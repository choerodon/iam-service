package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.producer.StartSagaBuilder;
import io.choerodon.asgard.saga.producer.TransactionalProducer;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ApplicationSearchDTO;
import io.choerodon.iam.app.service.ApplicationService;
import io.choerodon.iam.infra.asserts.ApplicationAssertHelper;
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper;
import io.choerodon.iam.infra.asserts.ProjectAssertHelper;
import io.choerodon.iam.infra.common.utils.CollectionUtils;
import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.choerodon.iam.infra.dto.ApplicationExplorationDTO;
import io.choerodon.iam.infra.enums.ApplicationCategory;
import io.choerodon.iam.infra.enums.ApplicationType;
import io.choerodon.iam.infra.mapper.ApplicationExplorationMapper;
import io.choerodon.iam.infra.mapper.ApplicationMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.APP_CREATE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.APP_DELETE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.APP_DISABLE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.APP_ENABLE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.APP_UPDATE;

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

    private OrganizationAssertHelper organizationAssertHelper;

    private ProjectAssertHelper projectAssertHelper;

    private ApplicationAssertHelper applicationAssertHelper;

    private TransactionalProducer producer;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    public ApplicationServiceImpl(ApplicationMapper applicationMapper,
                                  TransactionalProducer producer,
                                  ApplicationExplorationMapper applicationExplorationMapper,
                                  OrganizationAssertHelper organizationAssertHelper,
                                  ProjectAssertHelper projectAssertHelper,
                                  ApplicationAssertHelper applicationAssertHelper) {
        this.applicationMapper = applicationMapper;
        this.producer = producer;
        this.applicationExplorationMapper = applicationExplorationMapper;
        this.organizationAssertHelper = organizationAssertHelper;
        this.projectAssertHelper = projectAssertHelper;
        this.applicationAssertHelper = applicationAssertHelper;
    }

    @Override
    @Saga(code = APP_CREATE, description = "iam创建应用", inputSchemaClass = ApplicationDTO.class)
    @Transactional(rollbackFor = Exception.class)
    public ApplicationDTO create(ApplicationDTO applicationDTO) {
        organizationAssertHelper.organizationNotExisted(applicationDTO.getOrganizationId());
        validate(applicationDTO);
        //combination-application不能选项目
        if (ObjectUtils.isEmpty(applicationDTO.getProjectId())) {
            applicationDTO.setProjectId(0L);
        }
        Long projectId = applicationDTO.getProjectId();
        if (!PROJECT_DOES_NOT_EXIST_ID.equals(projectId)) {
            projectAssertHelper.projectNotExisted(projectId);
        }
        String combination = ApplicationCategory.COMBINATION.code();
        boolean isCombination = combination.equals(applicationDTO.getApplicationCategory());

        ApplicationDTO result;
        boolean sendMessage =
                (!isCombination
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
                                doInsert(applicationDTO);
                                //关系表插入路径
                                insertExploration(applicationDTO.getId());
                                ApplicationDTO dto = applicationMapper.selectByPrimaryKey(applicationDTO.getId());
                                dto.setFrom(applicationDTO.getFrom());
                                builder
                                        .withPayloadAndSerialize(dto)
                                        .withRefId(String.valueOf(applicationDTO.getId()));
                                return applicationDTO;
                            });
        } else {
            doInsert(applicationDTO);
            //关系表插入路径
            insertExploration(applicationDTO.getId());
            result = applicationDTO;
        }
        result.setObjectVersionNumber(1L);
        if (isCombination) {
            processDescendants(applicationDTO, result);
        }
        return result;
    }

    private void processDescendants(ApplicationDTO applicationDTO, ApplicationDTO result) {
        List<Long> descendantIds = applicationDTO.getDescendantIds();
        if (descendantIds != null) {
            Long[] array = new Long[descendantIds.size()];
            addToCombination(result.getOrganizationId(), result.getId(), descendantIds.toArray(array));
        }
    }

    private void insertExploration(Long appId) {
        ApplicationExplorationDTO example = new ApplicationExplorationDTO();
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

    private void doInsert(ApplicationDTO applicationDTO) {
        if (applicationMapper.insertSelective(applicationDTO) != 1) {
            throw new CommonException("error.application.insert");
        }
    }

    @Override
    @Saga(code = APP_UPDATE, description = "iam更新应用", inputSchemaClass = ApplicationDTO.class)
    @Transactional(rollbackFor = Exception.class)
    public ApplicationDTO update(ApplicationDTO applicationDTO) {
        Long originProjectId =
                ObjectUtils.isEmpty(applicationDTO.getProjectId()) ? PROJECT_DOES_NOT_EXIST_ID : applicationDTO.getProjectId();
        applicationDTO.setProjectId(originProjectId);
        validate(applicationDTO);
        ApplicationDTO dto = applicationAssertHelper.applicationNotExisted(applicationDTO.getId());
        Long targetProjectId = dto.getProjectId();
        preUpdate(applicationDTO, dto);
        ApplicationDTO result;
        String combination = ApplicationCategory.COMBINATION.code();
        boolean isCombination = combination.equals(dto.getApplicationCategory());
        if (devopsMessage && !isCombination) {
            if (PROJECT_DOES_NOT_EXIST_ID.equals(targetProjectId)) {
                if (!PROJECT_DOES_NOT_EXIST_ID.equals(originProjectId)) {
                    //send create event
                    result = sendEvent(applicationDTO, APP_CREATE);
                } else {
                    //do not send event
                    result = doUpdate(applicationDTO);
                }
            } else {
                //send update event
                result = sendEvent(applicationDTO, APP_UPDATE);
            }
        } else {
            //do not sent event
            result = doUpdate(applicationDTO);
        }
        if (isCombination) {
            processDescendants(applicationDTO, result);
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @Saga(code = APP_DELETE, description = "iam删除应用", inputSchemaClass = ApplicationDTO.class)
    public void delete(Long organizationId, Long id) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        ApplicationDTO applicationDTO = applicationAssertHelper.applicationNotExisted(id);
        applicationExplorationMapper.deleteDescendantByApplicationId(id);
        deleteAndSendEvent(applicationDTO, APP_DELETE);
    }

    /**
     * 删除应用并发送saga消息通知.
     *
     * @param application 应用DTO
     * @param sagaCode    saga编码
     */
    private void deleteAndSendEvent(ApplicationDTO application, String sagaCode) {
        producer.apply(
                StartSagaBuilder
                        .newBuilder()
                        .withLevel(ResourceLevel.ORGANIZATION)
                        .withRefType("application")
                        .withSagaCode(sagaCode),
                builder -> {
                    if (applicationMapper.deleteByPrimaryKey(application) != 1) {
                        throw new CommonException("error.application.delete");
                    }
                    builder
                            .withPayloadAndSerialize(application)
                            .withRefId(String.valueOf(application.getId()))
                            .withSourceId(application.getOrganizationId());
                });
    }

    private ApplicationDTO sendEvent(ApplicationDTO applicationDTO, String sagaCode) {
        return producer.applyAndReturn(
                StartSagaBuilder
                        .newBuilder()
                        .withLevel(ResourceLevel.ORGANIZATION)
                        .withRefType("application")
                        .withSagaCode(sagaCode),
                builder -> {
                    ApplicationDTO application = doUpdate(applicationDTO);
                    builder
                            .withPayloadAndSerialize(application)
                            .withRefId(String.valueOf(application.getId()))
                            .withSourceId(application.getOrganizationId());
                    return application;
                });
    }

    private ApplicationDTO doUpdate(ApplicationDTO applicationDTO) {
        if (applicationMapper.updateByPrimaryKeySelective(applicationDTO) != 1) {
            throw new CommonException("error.application.update");
        }
        return applicationMapper.selectByPrimaryKey(applicationDTO.getId());
    }

    @Override
    public PageInfo<ApplicationDTO> pagingQuery(int page, int size, ApplicationSearchDTO applicationSearchDTO, Boolean withDescendants) {
        PageInfo<ApplicationDTO> result = PageHelper.startPage(page, size).doSelectPageInfo(() -> applicationMapper.fuzzyQuery(applicationSearchDTO));
        if (withDescendants) {
            result.getList().forEach(app -> {
                //组合应用查询所有后代
                if (ApplicationCategory.COMBINATION.code().equals(app.getApplicationCategory())) {
                    List<ApplicationExplorationDTO> applicationExplorations = applicationExplorationMapper.selectDescendants(generatePath(app.getId()));
                    //todo dfs算法优化
                    processTreeData(app, applicationExplorations);
                }
            });
        }
        return result;
    }

    private void processTreeData(ApplicationDTO app, List<ApplicationExplorationDTO> applicationExplorations) {
        Long appId = app.getId();
        List<ApplicationDTO> applications = new ArrayList<>();
        app.setDescendants(applications);
        applicationExplorations.forEach(ae -> {
            if (appId.equals(ae.getParentId())) {
                ApplicationDTO dto = new ApplicationDTO();
                dto.setId(ae.getApplicationId());
                dto.setName(ae.getApplicationName());
                dto.setCode(ae.getApplicationCode());
                dto.setApplicationCategory(ae.getApplicationCategory());
                dto.setApplicationType(ae.getApplicationType());
                dto.setEnabled(ae.getApplicationEnabled());
                dto.setProjectId(ae.getProjectId());
                dto.setProjectCode(ae.getProjectCode());
                dto.setProjectName(ae.getProjectName());
                dto.setImageUrl(ae.getProjectImageUrl());
                applications.add(dto);
                processTreeData(dto, applicationExplorations);
            }
        });
    }

    @Override
    @Saga(code = APP_ENABLE, description = "iam启用应用", inputSchemaClass = ApplicationDTO.class)
    public ApplicationDTO enable(Long id) {
        return enable(id, true);
    }

    @Override
    @Saga(code = APP_DISABLE, description = "iam禁用应用", inputSchemaClass = ApplicationDTO.class)
    public ApplicationDTO disable(Long id) {
        return enable(id, false);
    }

    private ApplicationDTO enable(Long id, boolean enabled) {
        ApplicationDTO applicationDTO = applicationAssertHelper.applicationNotExisted(id);
        applicationDTO.setEnabled(enabled);
        String sagaCode = enabled ? APP_ENABLE : APP_DISABLE;
        String combination = ApplicationCategory.COMBINATION.code();
        boolean sendMessage =
                (!combination.equals(applicationDTO.getApplicationCategory())
                        && !PROJECT_DOES_NOT_EXIST_ID.equals(applicationDTO.getProjectId())
                        && devopsMessage);
        if (sendMessage) {
            return sendEvent(applicationDTO, sagaCode);
        } else {
            return doUpdate(applicationDTO);
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
        organizationAssertHelper.organizationNotExisted(organizationId);
        if (!ApplicationCategory.COMBINATION.code().equals(applicationAssertHelper.applicationNotExisted(id).getApplicationCategory())) {
            throw new CommonException("error.application.addToCombination.not.support");
        }
        Set<Long> idSet = new HashSet<>(Arrays.asList(ids));
        if (!idSet.isEmpty()) {
            isApplicationsIllegal(organizationId, idSet);
        }

        //查询直接儿子
        List<ApplicationExplorationDTO> originDirectDescendant =
                applicationExplorationMapper.selectDirectDescendantByApplicationId(id);
        //筛选哪些儿子不变，哪些要删除，哪些要新增
        List<Long> originDirectDescendantIds =
                originDirectDescendant.stream().map(ApplicationExplorationDTO::getApplicationId).collect(Collectors.toList());
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
            Map<Long, List<ApplicationExplorationDTO>> descendantMap = getDescendantMap(new HashSet<>(insertList));
            canAddToCombination(id, idSet, descendantMap);
            for (Map.Entry<Long, Set<String>> entry : rootIdMap.entrySet()) {
                Long rootId = entry.getKey();
                Set<String> paths = entry.getValue();
                paths.forEach(path -> addTreeNode(id, descendantMap, rootId, path));
            }
        }
        if (!deleteList.isEmpty()) {
            Map<Long, List<ApplicationExplorationDTO>> descendantMap = getDescendantMap(new HashSet<>(deleteList));
            for (Map.Entry<Long, Set<String>> entry : rootIdMap.entrySet()) {
                Set<String> paths = entry.getValue();
                paths.forEach(path -> deleteTreeNode(descendantMap, path));
            }
        }
    }

    private void addTreeNode(Long id, Map<Long, List<ApplicationExplorationDTO>> descendantMap, Long rootId, String parentPath) {
        for (Map.Entry<Long, List<ApplicationExplorationDTO>> entry : descendantMap.entrySet()) {
            Long key = entry.getKey();
            List<ApplicationExplorationDTO> applicationExplorations = entry.getValue();
            applicationExplorations.forEach(ae -> {
                StringBuilder builder =
                        new StringBuilder().append(parentPath).append(ae.getPath().substring(1));
                String path = builder.toString();
                ApplicationExplorationDTO example = new ApplicationExplorationDTO();
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

    private void deleteTreeNode(Map<Long, List<ApplicationExplorationDTO>> descendantMap, String parentPath) {
        for (Map.Entry<Long, List<ApplicationExplorationDTO>> entry : descendantMap.entrySet()) {
            List<ApplicationExplorationDTO> applicationExplorations = entry.getValue();
            applicationExplorations.forEach(ae -> {
                StringBuilder builder =
                        new StringBuilder().append(parentPath).append(ae.getPath().substring(1));
                String path = builder.toString();
                ApplicationExplorationDTO example = new ApplicationExplorationDTO();
                example.setPath(path);
                applicationExplorationMapper.delete(example);
            });
        }
    }

    private void canAddToCombination(Long id, Set<Long> idSet, Map<Long, List<ApplicationExplorationDTO>> descendantMap) {
        if (idSet.contains(id)) {
            throw new CommonException("error.application.add2combination.circle", id, id);
        }
        Set<ApplicationExplorationDTO> set = new HashSet<>();
        for (Map.Entry<Long, List<ApplicationExplorationDTO>> entry : descendantMap.entrySet()) {
            set.addAll(entry.getValue());
        }
        List<Long> illegalIds =
                set
                        .stream()
                        .filter(ae -> ae.getApplicationId().equals(id))
                        .map(ApplicationExplorationDTO::getRootId)
                        .collect(Collectors.toList());
        if (!illegalIds.isEmpty()) {
            throw new CommonException("error.application.add2combination.circle", Arrays.toString(illegalIds.toArray()), id);
        }
    }


    @Override
    public List<ApplicationExplorationDTO> queryDescendant(Long id) {
        if (!ApplicationCategory.COMBINATION.code().equals(
                applicationAssertHelper.applicationNotExisted(id).getApplicationCategory())) {
            throw new CommonException("error.application.queryDescendant.not.support");
        }

        return applicationExplorationMapper.selectDescendants(generatePath(id));
    }

    @Override
    public PageInfo<ApplicationDTO> queryApplicationList(int page, int size, Long id, String name, String code) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() ->
                applicationExplorationMapper.selectDescendantApplications(generatePath(id), ApplicationCategory.APPLICATION.code(), name, code));
    }

    @Override
    public List<ApplicationDTO> queryEnabledApplication(Long organizationId, Long id) {
        if (!ApplicationCategory.COMBINATION.code().equals(applicationAssertHelper.applicationNotExisted(id).getApplicationCategory())) {
            throw new CommonException("error.application.query.not.support");
        }
        ApplicationDTO example = new ApplicationDTO();
        example.setOrganizationId(organizationId);
        List<ApplicationDTO> applications = applicationMapper.select(example);
        List<ApplicationExplorationDTO> ancestors = applicationExplorationMapper.selectAncestorByApplicationId(id);
        Set<Long> ancestorIds = ancestors.stream().map(ApplicationExplorationDTO::getApplicationId).collect(Collectors.toSet());
        if (ancestorIds.isEmpty()) {
            ancestorIds.add(id);
        }
        List<ApplicationDTO> apps =
                applications.stream().filter(app -> !ancestorIds.contains(app.getId())).collect(Collectors.toList());
        return apps;
    }

    @Override
    public ApplicationDTO query(Long id) {
        return applicationMapper.selectByPrimaryKey(id);
    }

    private Map<Long, Set<String>> getRootIdMap(Long id) {
        ApplicationExplorationDTO example = new ApplicationExplorationDTO();
        example.setApplicationId(id);
        List<ApplicationExplorationDTO> pathNodes = applicationExplorationMapper.select(example);
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

    private Map<Long, List<ApplicationExplorationDTO>> getDescendantMap(Set<Long> idSet) {
        Map<Long, List<ApplicationExplorationDTO>> map = new HashMap<>(idSet.size());
        idSet.forEach(currentId -> {
            List<ApplicationExplorationDTO> list =
                    applicationExplorationMapper.selectDescendantByPath(generatePath(currentId));
            map.put(currentId, list);
        });
        return map;
    }

    private void isApplicationsIllegal(Long organizationId, Set<Long> idSet) {
        ////oracle In-list上限为1000，这里List size要小于1000
        List<Set<Long>> list = CollectionUtils.subSet(idSet, 999);
        List<ApplicationDTO> applications = new ArrayList<>();
        list.forEach(set -> applications.addAll(applicationMapper.matchId(set)));
        //校验是不是在组织下面
        List<Long> illegalIds =
                applications.stream().filter(
                        app -> !organizationId.equals(app.getOrganizationId()))
                        .map(ApplicationDTO::getId).collect(Collectors.toList());
        if (!illegalIds.isEmpty()) {
            throw new CommonException("error.application.add2combination.target.not.belong2organization",
                    Arrays.toString(illegalIds.toArray()), organizationId);
        }
        //校验应用是否都存在
        if (idSet.size() != applications.size()) {
            List<Long> existedIds =
                    applications.stream().map(ApplicationDTO::getId).collect(Collectors.toList());
            illegalIds = idSet.stream().filter(id -> !existedIds.contains(id)).collect(Collectors.toList());
            throw new CommonException("error.application.add2combination.not.existed", Arrays.toString(illegalIds.toArray()));
        }
    }

    private void checkCode(ApplicationDTO applicationDTO) {
        String code = applicationDTO.getCode();
        ApplicationDTO example = new ApplicationDTO();
        example.setCode(code);
        example.setOrganizationId(applicationDTO.getOrganizationId());
        Long id = applicationDTO.getId();
        check(example, id, "error.application.code.duplicate");
    }

    private void check(ApplicationDTO example, Long id, String message) {
        boolean check4Insert = (id == null);
        if (check4Insert) {
            if (!applicationMapper.select(example).isEmpty()) {
                throw new CommonException(message);
            }
        } else {
            List<ApplicationDTO> applications = applicationMapper.select(example);
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
        ApplicationDTO example = new ApplicationDTO();
        example.setName(name);
        example.setOrganizationId(applicationDTO.getOrganizationId());
        Long id = applicationDTO.getId();
        check(example, id, "error.application.name.duplicate");
    }


    private void preUpdate(ApplicationDTO applicationDTO, ApplicationDTO application) {
        boolean canUpdateProject = PROJECT_DOES_NOT_EXIST_ID.equals(application.getProjectId());
        if (!canUpdateProject) {
            //为空的情况下，调用updateByPrimaryKeySelective这一列不会被更新
            applicationDTO.setProjectId(null);
        } else if (!PROJECT_DOES_NOT_EXIST_ID.equals(applicationDTO.getProjectId())) {
            projectAssertHelper.projectNotExisted(applicationDTO.getProjectId());
        }
        applicationDTO.setOrganizationId(null);
        applicationDTO.setApplicationCategory(null);
        applicationDTO.setCode(null);
        applicationAssertHelper.objectVersionNumberNotNull(applicationDTO.getObjectVersionNumber());
    }

    private void validate(ApplicationDTO applicationDTO) {
        String category = applicationDTO.getApplicationCategory();
        if (!ApplicationCategory.matchCode(category)) {
            throw new CommonException("error.application.applicationCategory.illegal");
        }
    }
}
