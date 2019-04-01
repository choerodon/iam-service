package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.*;

import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.producer.StartSagaBuilder;
import io.choerodon.asgard.saga.producer.TransactionalProducer;
import io.choerodon.core.domain.Page;
import io.choerodon.core.domain.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ApplicationDTO;
import io.choerodon.iam.api.dto.ApplicationExplorationWithAppDTO;
import io.choerodon.iam.api.dto.ApplicationSearchDTO;
import io.choerodon.iam.app.service.ApplicationService;
import io.choerodon.iam.infra.common.utils.AssertHelper;
import io.choerodon.iam.infra.common.utils.CollectionUtils;
import io.choerodon.iam.infra.dataobject.ApplicationDO;
import io.choerodon.iam.infra.dataobject.ApplicationExplorationDO;
import io.choerodon.iam.infra.enums.ApplicationCategory;
import io.choerodon.iam.infra.enums.ApplicationType;
import io.choerodon.iam.infra.mapper.ApplicationExplorationMapper;
import io.choerodon.iam.infra.mapper.ApplicationMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author superlee
 * @since 0.15.0
 */
@Service
public class ApplicationServiceImpl implements ApplicationService {

    private static final Long PROJECT_DOES_NOT_EXIST_ID = 0L;
    private static final String SEPARATOR = "/";

    private ApplicationMapper applicationMapper;

    private ApplicationExplorationMapper applicationExplorationMapper;

    private AssertHelper assertHelper;

    private TransactionalProducer producer;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    private final ModelMapper modelMapper = new ModelMapper();

    public ApplicationServiceImpl(ApplicationMapper applicationMapper,
                                  AssertHelper assertHelper,
                                  TransactionalProducer producer,
                                  ApplicationExplorationMapper applicationExplorationMapper) {
        this.applicationMapper = applicationMapper;
        this.assertHelper = assertHelper;
        this.producer = producer;
        this.applicationExplorationMapper = applicationExplorationMapper;
    }

    @Override
    @Saga(code = APP_CREATE, description = "iam创建应用", inputSchemaClass = ApplicationDTO.class)
    public ApplicationDTO create(ApplicationDTO applicationDTO) {
        assertHelper.organizationNotExisted(applicationDTO.getOrganizationId());
        validate(applicationDTO);
        //combination-application不能选项目
        String combination = ApplicationCategory.COMBINATION.code();
        if (ObjectUtils.isEmpty(applicationDTO.getProjectId())) {
            applicationDTO.setProjectId(0L);
        }
        ApplicationDO applicationDO = modelMapper.map(applicationDTO, ApplicationDO.class);
        Long projectId = applicationDO.getProjectId();
        if (!PROJECT_DOES_NOT_EXIST_ID.equals(projectId)) {
            assertHelper.projectNotExisted(projectId);
        }

        ApplicationDO result;
        boolean sendMessage =
                (!combination.equals(applicationDTO.getApplicationCategory())
                        && !PROJECT_DOES_NOT_EXIST_ID.equals(projectId)
                        && devopsMessage);
        if (sendMessage) {
            result =
                    producer.applyAndReturn(
                            StartSagaBuilder
                                    .newBuilder()
                                    .withLevel(ResourceLevel.ORGANIZATION)
                                    .withSourceId(applicationDTO.getOrganizationId())
                                    .withRefType("application")
                                    .withSagaCode(APP_CREATE),
                            builder -> {
                                doInsert(applicationDO);
                                //关系表插入路径
                                insertExploration(applicationDO.getId());
                                ApplicationDTO dto = modelMapper.map(applicationDO, ApplicationDTO.class);
                                dto.setFrom(applicationDTO.getFrom());
                                builder
                                        .withPayloadAndSerialize(dto)
                                        .withRefId(String.valueOf(applicationDO.getId()));
                                return applicationDO;
                            });
        } else {
            doInsert(applicationDO);
            //关系表插入路径
            insertExploration(applicationDO.getId());
            result = applicationDO;
        }
        result.setObjectVersionNumber(1L);
        return modelMapper.map(result, ApplicationDTO.class);
    }

    private void insertExploration(Long appId) {
        ApplicationExplorationDO example = new ApplicationExplorationDO();
        example.setApplicationId(appId);
        String path = generatePath(appId);
        example.setPath(path);
        example.setApplicationEnabled(true);
        example.setRootId(appId);
        example.setHashcode(String.valueOf(path.hashCode()));
        applicationExplorationMapper.insertSelective(example);
    }

    private String generatePath(Long appId) {
        StringBuilder builder = new StringBuilder();
        return builder.append(SEPARATOR).append(appId).append(SEPARATOR).toString();
    }

    private void doInsert(ApplicationDO applicationDO) {
        if (applicationMapper.insertSelective(applicationDO) != 1) {
            throw new CommonException("error.application.insert");
        }
    }

    @Override
    @Saga(code = APP_UPDATE, description = "iam更新应用", inputSchemaClass = ApplicationDO.class)
    public ApplicationDTO update(ApplicationDTO applicationDTO) {
        Long originProjectId =
                ObjectUtils.isEmpty(applicationDTO.getProjectId()) ? PROJECT_DOES_NOT_EXIST_ID : applicationDTO.getProjectId();
        applicationDTO.setProjectId(originProjectId);
        validate(applicationDTO);
        ApplicationDO applicationDO = assertHelper.applicationNotExisted(applicationDTO.getId());
        Long targetProjectId = applicationDO.getProjectId();
        preUpdate(applicationDTO, applicationDO);
        ApplicationDO application = modelMapper.map(applicationDTO, ApplicationDO.class);
        ApplicationDO result;
        String combination = ApplicationCategory.COMBINATION.code();
        if (devopsMessage && !combination.equals(applicationDO.getApplicationCategory())) {
            if (PROJECT_DOES_NOT_EXIST_ID.equals(targetProjectId)) {
                if (!PROJECT_DOES_NOT_EXIST_ID.equals(originProjectId)) {
                    //send create event
                    result = sendEvent(application, APP_CREATE);
                } else {
                    //do not send event
                    result = doUpdate(application);
                }
            } else {
                //send update event
                result = sendEvent(application, APP_UPDATE);
            }
        } else {
            //do not sent event
            result = doUpdate(application);
        }
        return modelMapper.map(result, ApplicationDTO.class);
    }

    private ApplicationDO sendEvent(ApplicationDO applicationDO, String sagaCode) {
        return producer.applyAndReturn(
                StartSagaBuilder
                        .newBuilder()
                        .withLevel(ResourceLevel.ORGANIZATION)
                        .withRefType("application")
                        .withSagaCode(sagaCode),
                builder -> {
                    ApplicationDO application = doUpdate(applicationDO);
                    builder
                            .withPayloadAndSerialize(application)
                            .withRefId(String.valueOf(application.getId()))
                            .withSourceId(application.getOrganizationId());
                    return application;
                });
    }

    private ApplicationDO doUpdate(ApplicationDO applicationDO) {
        if (applicationMapper.updateByPrimaryKeySelective(applicationDO) != 1) {
            throw new CommonException("error.application.update");
        }
        return applicationMapper.selectByPrimaryKey(applicationDO.getId());
    }

    @Override
    public Page<ApplicationDTO> pagingQuery(PageRequest pageRequest, ApplicationSearchDTO applicationSearchDTO) {
        Page<ApplicationDO> pages = PageHelper.doPageAndSort(pageRequest, () -> applicationMapper.fuzzyQuery(applicationSearchDTO));
        List<ApplicationDTO> dtoList =
                modelMapper.map(pages.getContent(), new TypeToken<List<ApplicationDTO>>() {
                }.getType());
        return new Page<>(dtoList, new PageInfo(pages.getNumber(), pages.getSize()), pages.getTotalElements());
    }

    @Override
    @Saga(code = APP_ENABLE, description = "iam启用应用", inputSchemaClass = ApplicationDO.class)
    public ApplicationDTO enable(Long id) {
        return enable(id, true);
    }

    @Override
    @Saga(code = APP_DISABLE, description = "iam禁用应用", inputSchemaClass = ApplicationDO.class)
    public ApplicationDTO disable(Long id) {
        return enable(id, false);
    }

    private ApplicationDTO enable(Long id, boolean enabled) {
        ApplicationDO applicationDO = assertHelper.applicationNotExisted(id);
        applicationDO.setEnabled(enabled);
        String sagaCode = enabled ? APP_ENABLE : APP_DISABLE;
        String combination = ApplicationCategory.COMBINATION.code();
        boolean sendMessage =
                (!combination.equals(applicationDO.getApplicationCategory())
                        && !PROJECT_DOES_NOT_EXIST_ID.equals(applicationDO.getProjectId())
                        && devopsMessage);
        if (sendMessage) {
            return modelMapper.map(sendEvent(applicationDO, sagaCode), ApplicationDTO.class);
        } else {
            return modelMapper.map(doUpdate(applicationDO), ApplicationDTO.class);
        }
    }

    @Override
    public List<String> types() {
        List<String> types = new ArrayList<>();
        for (ApplicationType applicationType : ApplicationType.values()) {
            types.add(applicationType.code());
        }
        return types;
    }

    @Override
    public void check(ApplicationDTO applicationDTO) {
        if (!StringUtils.isEmpty(applicationDTO.getName())) {
            //name是组织下唯一
            checkName(applicationDTO);
        }
        if (!StringUtils.isEmpty((applicationDTO.getCode()))) {
            //如果选的有项目，code是项目下唯一；如果没选项目，code是组织下唯一
            checkCode(applicationDTO);
        }
    }

    /**
     * id为目标应用，ids为子应用
     *
     * @param organizationId 组织id
     * @param id             应用id，applicationCategory为combination-application {@link ApplicationCategory#COMBINATION}
     * @param ids            需要被分配的应用或组合应用
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addToCombination(Long organizationId, Long id, Long[] ids) {
        assertHelper.organizationNotExisted(organizationId);
        if (!ApplicationCategory.COMBINATION.code().equals(assertHelper.applicationNotExisted(id).getApplicationCategory())) {
            throw new CommonException("error.application.addToCombination.not.support");
        }
        Set<Long> idSet = new HashSet<>(Arrays.asList(ids));
        if (!idSet.isEmpty()) {
            isApplicationsIllegal(organizationId, idSet);
        }

        //查询直接儿子
        List<ApplicationExplorationDO> originDirectDescendant =
                applicationExplorationMapper.selectDirectDescendantByApplicationId(id);
        //筛选哪些儿子不变，哪些要删除，哪些要新增
        List<Long> originDirectDescendantIds =
                originDirectDescendant.stream().map(ApplicationExplorationDO::getApplicationId).collect(Collectors.toList());
        List<Long> intersection = originDirectDescendantIds.stream().filter(idSet::contains).collect(Collectors.toList());
        List<Long> insertList = idSet.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        List<Long> deleteList = originDirectDescendantIds.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        //校验组合应用或应用 idSet 是否能放到 组合应用=id 下面。
        //查询到达目标应用的所有路径，key为rootId,value为在该root节点下的所有路径
        Map<Long, Set<String>> rootIdMap = getRootIdMap(id);
        if (!insertList.isEmpty()) {
            //查询子应用的所有后代，并校验是否构成环
            Map<Long, List<ApplicationExplorationDO>> descendantMap = getDescendantMap(new HashSet<>(insertList));
            canAddToCombination(id, idSet, descendantMap);
            for (Map.Entry<Long, Set<String>> entry : rootIdMap.entrySet()) {
                Long rootId = entry.getKey();
                Set<String> paths = entry.getValue();
                paths.forEach(path -> addTreeNode(id, descendantMap, rootId, path));
            }
        }
        if (!deleteList.isEmpty()) {
            Map<Long, List<ApplicationExplorationDO>> descendantMap = getDescendantMap(new HashSet<>(deleteList));
            for (Map.Entry<Long, Set<String>> entry : rootIdMap.entrySet()) {
                Set<String> paths = entry.getValue();
                paths.forEach(path -> deleteTreeNode(descendantMap, path));
            }
        }
    }

    private void addTreeNode(Long id, Map<Long, List<ApplicationExplorationDO>> descendantMap, Long rootId, String parentPath) {
        for (Map.Entry<Long, List<ApplicationExplorationDO>> entry : descendantMap.entrySet()) {
            Long key = entry.getKey();
            List<ApplicationExplorationDO> applicationExplorations = entry.getValue();
            applicationExplorations.forEach(ae -> {
                StringBuilder builder =
                        new StringBuilder().append(parentPath).append(ae.getPath().substring(1));
                String path = builder.toString();
                ApplicationExplorationDO example = new ApplicationExplorationDO();
                example.setApplicationId(ae.getApplicationId());
                example.setPath(path);
                example.setHashcode(String.valueOf(path.hashCode()));
                example.setRootId(rootId);
                if (ae.getApplicationId().equals(key)) {
                    example.setParentId(id);
                } else {
                    example.setParentId(ae.getParentId());
                }
                example.setId(null);
                example.setEnabled(true);
                applicationExplorationMapper.insertSelective(example);
            });
        }
    }

    private void deleteTreeNode(Map<Long, List<ApplicationExplorationDO>> descendantMap, String parentPath) {
        for (Map.Entry<Long, List<ApplicationExplorationDO>> entry : descendantMap.entrySet()) {
            List<ApplicationExplorationDO> applicationExplorations = entry.getValue();
            applicationExplorations.forEach(ae -> {
                StringBuilder builder =
                        new StringBuilder().append(parentPath).append(ae.getPath().substring(1));
                String path = builder.toString();
                ApplicationExplorationDO example = new ApplicationExplorationDO();
                example.setPath(path);
                applicationExplorationMapper.delete(example);
            });
        }
    }

    private void canAddToCombination(Long id, Set<Long> idSet, Map<Long, List<ApplicationExplorationDO>> descendantMap) {
        if (idSet.contains(id)) {
            throw new CommonException("error.application.add2combination.circle", id, id);
        }
        Set<ApplicationExplorationDO> set = new HashSet<>();
        for (Map.Entry<Long, List<ApplicationExplorationDO>> entry : descendantMap.entrySet()) {
            set.addAll(entry.getValue());
        }
        List<Long> illegalIds =
                set
                        .stream()
                        .filter(ae -> ae.getApplicationId().equals(id))
                        .map(ApplicationExplorationDO::getRootId)
                        .collect(Collectors.toList());
        if (!illegalIds.isEmpty()) {
            throw new CommonException("error.application.add2combination.circle", Arrays.toString(illegalIds.toArray()), id);
        }
    }


    @Override
    public List<ApplicationExplorationWithAppDTO> queryDescendant(Long id) {
        if (!ApplicationCategory.COMBINATION.code().equals(assertHelper.applicationNotExisted(id).getApplicationCategory())) {
            throw new CommonException("error.application.queryDescendant.not.support");
        }
        List<ApplicationExplorationDO> result = applicationExplorationMapper.selectDescendants(generatePath(id));
        return
                modelMapper.map(result, new TypeToken<List<ApplicationExplorationWithAppDTO>>() {
                }.getType());
    }

    @Override
    public Page<ApplicationDTO> queryApplicationList(PageRequest pageRequest, Long id, String name, String code) {
        Page<ApplicationDO> pages =
                PageHelper.doPageAndSort(pageRequest, () ->
                        applicationExplorationMapper.selectDescendantApplications(generatePath(id), ApplicationCategory.APPLICATION.code(), name, code));
        List<ApplicationDTO> dtoList =
                modelMapper.map(pages.getContent(), new TypeToken<List<ApplicationDTO>>() {
                }.getType());
        return new Page<>(dtoList, new PageInfo(pages.getNumber(), pages.getSize()), pages.getTotalElements());
    }

    @Override
    public List<ApplicationDTO> queryEnabledApplication(Long organizationId, Long id) {
        if (!ApplicationCategory.COMBINATION.code().equals(assertHelper.applicationNotExisted(id).getApplicationCategory())) {
            throw new CommonException("error.application.query.not.support");
        }
        ApplicationDO example = new ApplicationDO();
        example.setOrganizationId(organizationId);
        List<ApplicationDO> applications = applicationMapper.select(example);
        List<ApplicationExplorationDO> ancestors = applicationExplorationMapper.selectAncestorByApplicationId(id);
        Set<Long> ancestorIds = ancestors.stream().map(ApplicationExplorationDO::getApplicationId).collect(Collectors.toSet());
        if (ancestorIds.isEmpty()) {
            ancestorIds.add(id);
        }
        List<ApplicationDO> apps =
                applications.stream().filter(app -> !ancestorIds.contains(app.getId())).collect(Collectors.toList());
        return
                modelMapper.map(apps, new TypeToken<List<ApplicationDTO>>() {
                }.getType());
    }

    @Override
    public ApplicationDTO query(Long id) {
        return modelMapper.map(applicationMapper.selectByPrimaryKey(id), ApplicationDTO.class);
    }

    private Map<Long, Set<String>> getRootIdMap(Long id) {
        ApplicationExplorationDO example = new ApplicationExplorationDO();
        example.setApplicationId(id);
        List<ApplicationExplorationDO> pathNodes = applicationExplorationMapper.select(example);
        Map<Long, Set<String>> map = new HashMap<>();
        pathNodes.forEach(node -> {
            Long rootId = node.getRootId();
            Set<String> paths = map.get(rootId);
            if (paths == null) {
                paths = new HashSet<>();
                map.put(rootId, paths);
            }
            paths.add(node.getPath());
        });
        return map;
    }

    private Map<Long, List<ApplicationExplorationDO>> getDescendantMap(Set<Long> idSet) {
        Map<Long, List<ApplicationExplorationDO>> map = new HashMap<>(idSet.size());
        idSet.forEach(currentId -> {
            List<ApplicationExplorationDO> list =
                    applicationExplorationMapper.selectDescendantByPath(generatePath(currentId));
            map.put(currentId, list);
        });
        return map;
    }

    private void isApplicationsIllegal(Long organizationId, Set<Long> idSet) {
        ////oracle In-list上限为1000，这里List size要小于1000
        List<Set<Long>> list = CollectionUtils.subSet(idSet, 999);
        List<ApplicationDO> applications = new ArrayList<>();
        list.forEach(set -> applications.addAll(applicationMapper.matchId(set)));
        //校验是不是在组织下面
        List<Long> illegalIds =
                applications.stream().filter(
                        app -> !organizationId.equals(app.getOrganizationId()))
                        .map(ApplicationDO::getId).collect(Collectors.toList());
        if (!illegalIds.isEmpty()) {
            throw new CommonException("error.application.add2combination.target.not.belong2organization",
                    Arrays.toString(illegalIds.toArray()), organizationId);
        }
        //校验应用是否都存在
        if (idSet.size() != applications.size()) {
            List<Long> existedIds =
                    applications.stream().map(ApplicationDO::getId).collect(Collectors.toList());
            illegalIds = idSet.stream().filter(id -> !existedIds.contains(id)).collect(Collectors.toList());
            throw new CommonException("error.application.add2combination.not.existed", Arrays.toString(illegalIds.toArray()));
        }
    }

    private void checkCode(ApplicationDTO applicationDTO) {
        String code = applicationDTO.getCode();
        ApplicationDO example = new ApplicationDO();
        example.setCode(code);
        example.setOrganizationId(applicationDTO.getOrganizationId());
        Long id = applicationDTO.getId();
        check(example, id, "error.application.code.duplicate");
    }

    private void check(ApplicationDO example, Long id, String message) {
        boolean check4Insert = (id == null);
        if (check4Insert) {
            if (!applicationMapper.select(example).isEmpty()) {
                throw new CommonException(message);
            }
        } else {
            List<ApplicationDO> applications = applicationMapper.select(example);
            if (applications.size() > 2) {
                throw new CommonException(message);
            }
            if (applications.size() == 1 && !applications.get(0).getId().equals(id)) {
                throw new CommonException(message);
            }
        }
    }

    private void checkName(ApplicationDTO applicationDTO) {
        String name = applicationDTO.getName();
        ApplicationDO example = new ApplicationDO();
        example.setName(name);
        example.setOrganizationId(applicationDTO.getOrganizationId());
        Long id = applicationDTO.getId();
        check(example, id, "error.application.name.duplicate");
    }


    private void preUpdate(ApplicationDTO applicationDTO, ApplicationDO applicationDO) {
        boolean canUpdateProject = PROJECT_DOES_NOT_EXIST_ID.equals(applicationDO.getProjectId());
        if (!canUpdateProject) {
            //为空的情况下，调用updateByPrimaryKeySelective这一列不会被更新
            applicationDTO.setProjectId(null);
        } else if (!PROJECT_DOES_NOT_EXIST_ID.equals(applicationDTO.getProjectId())) {
            assertHelper.projectNotExisted(applicationDTO.getProjectId());
        }
        applicationDTO.setOrganizationId(null).setApplicationCategory(null).setCode(null);
        assertHelper.objectVersionNumberNotNull(applicationDTO.getObjectVersionNumber());
    }

    private void validate(ApplicationDTO applicationDTO) {
        String category = applicationDTO.getApplicationCategory();
        String type = applicationDTO.getApplicationType();
        if (!ApplicationCategory.matchCode(category)) {
            throw new CommonException("error.application.applicationCategory.illegal");
        }
        if (!ApplicationType.matchCode(type)) {
            throw new CommonException("error.application.applicationType.illegal");
        }
    }
}
