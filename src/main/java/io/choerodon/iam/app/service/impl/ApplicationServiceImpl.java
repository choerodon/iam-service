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
    @Saga(code = APP_CREATE, description = "iam创建应用", inputSchemaClass = ApplicationDO.class)
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
                                builder
                                        .withPayloadAndSerialize(applicationDO)
                                        .withRefId(String.valueOf(applicationDO.getId()));
                                return applicationDO;
                            });
        } else {
            doInsert(applicationDO);
            result = applicationDO;
        }
        result.setObjectVersionNumber(1L);
        return modelMapper.map(result, ApplicationDTO.class);
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
    public Page<ApplicationDTO> pagingQuery(PageRequest pageRequest, ApplicationDTO applicationDTO) {
        String param = applicationDTO.getParam();
        ApplicationDO example = modelMapper.map(applicationDTO, ApplicationDO.class);
        Page<ApplicationDO> pages = PageHelper.doPageAndSort(pageRequest, () -> applicationMapper.fuzzyQuery(example, param));
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
        if (!insertList.isEmpty()) {
            Map<Long, String> rootIdMap = getRootIdMap(id);
            Map<Long, List> map = canAddToCombination(id, new HashSet<>(insertList));
            for (Map.Entry<Long, String> entry : rootIdMap.entrySet()) {
                Long rootId = entry.getKey();
                String path = entry.getValue();
                addTreeNode(id, map, rootId, path);
            }
        }
        if (!deleteList.isEmpty()) {
            deleteTreeNode(id, deleteList);
        }
    }

    @Override
    public List<ApplicationExplorationWithAppDTO> queryDescendant(Long id) {
        if (!ApplicationCategory.COMBINATION.code().equals(assertHelper.applicationNotExisted(id).getApplicationCategory())) {
            throw new CommonException("error.application.queryDescendant.not.support");
        }
        List<ApplicationExplorationDO> doList = applicationExplorationMapper.selectDescendantWithApplication(id);
        return
                modelMapper.map(doList, new TypeToken<List<ApplicationExplorationWithAppDTO>>() {
                }.getType());
    }

    @Override
    public Page<ApplicationDTO> queryApplicationList(PageRequest pageRequest, Long id, String name, String code) {
        Page<ApplicationDO> pages =
                PageHelper.doPageAndSort(pageRequest, () ->
                        applicationExplorationMapper.selectDescendantApplications(id, ApplicationCategory.APPLICATION.code(), name, code));
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

    private void deleteTreeNode(Long id, List<Long> deleteList) {
        //查要移除的节点下所有的子节点
        Map<Long, List<ApplicationExplorationDO>> map = new HashMap<>(deleteList.size());
        deleteList.forEach(deleteAppId -> {
                    ApplicationExplorationDO example = new ApplicationExplorationDO();
                    example.setApplicationId(deleteAppId);
                    //查要移除的节点有没有其他父节点，如果有其他父节点的话，直接删除当前节点即可，不用重建树
                    if (applicationExplorationMapper.select(example).size() <= 1) {
                        map.put(deleteAppId, applicationExplorationMapper.selectDescendantByApplicationIdAndParentId(deleteAppId, id));
                    }
                }
        );
        applicationExplorationMapper.deleteDescendantByApplicationIdsAndParentId(new HashSet<>(deleteList), id);
        for (Map.Entry<Long, List<ApplicationExplorationDO>> entry : map.entrySet()) {
            Long appId = entry.getKey();
            List<ApplicationExplorationDO> list = entry.getValue();
            //如果只有一层节点，则不重建树
            if (list.size() > 1) {
                list.forEach(ae -> {
                    String path = SEPARATOR + appId + SEPARATOR;
                    if (appId.equals(ae.getApplicationId())) {
                        ae.setPath(path);
                        ae.setRootId(appId);
                        ae.setParentId(null);
                        ae.setHashcode(String.valueOf(path.hashCode()));
                        applicationExplorationMapper.insertSelective(ae);
                    } else {
                        String newPath = ae.getPath().substring(ae.getPath().indexOf(path));
                        ae.setPath(newPath);
                        ae.setRootId(appId);
                        Long parentId = getParentIdFromPath(ae.getApplicationId(), newPath);
                        ae.setParentId(parentId);
                        ae.setHashcode(String.valueOf(newPath.hashCode()));
                        applicationExplorationMapper.insertSelective(ae);
                    }
                });
            }
        }
    }

    private void addTreeNode(Long id, Map<Long, List> map, Long rootId, String parentPath) {
        for (Map.Entry<Long, List> entry : map.entrySet()) {
            Long key = entry.getKey();
            boolean isRootNode = (boolean) entry.getValue().get(0);
            List<ApplicationExplorationDO> applicationExplorations =
                    (List<ApplicationExplorationDO>) entry.getValue().get(1);
            //do insert
            addToTopNode(id, parentPath, rootId, key, isRootNode, applicationExplorations);
        }
    }

    private void addToTopNode(Long id, String parentPath, Long rootId, Long key, boolean isRootNode,
                              List<ApplicationExplorationDO> applicationExplorations) {
        if (isRootNode) {
            applicationExplorationMapper.deleteDescendantByApplicationId(key);
            if (applicationExplorations.isEmpty()) {
                StringBuilder builder = new StringBuilder();
                String path =
                        builder.append(SEPARATOR).append(id).append(SEPARATOR).append(key).append(SEPARATOR).toString();
                insert(id, rootId, key, path);
            } else {
                applicationExplorations.forEach(ae -> {
                    StringBuilder builder =
                            new StringBuilder().append(parentPath).append(ae.getPath().substring(1));
                    String path = builder.toString();
                    ae.setPath(path);
                    Long parentId = getParentIdFromPath(ae.getApplicationId(), path);
                    ae.setParentId(parentId == null ? id : parentId);
                    ae.setRootId(rootId);
                    ae.setHashcode(String.valueOf(path.hashCode()));
                    ae.setId(null);
                    applicationExplorationMapper.insertSelective(ae);
                });
            }

        } else {
            Set<String> paths = new HashSet<>();
            applicationExplorations.forEach(ae -> {
                String path = ae.getPath();
                StringBuilder builder = new StringBuilder();
                builder.append(SEPARATOR).append(key).append(SEPARATOR);
                String suffix = path.substring(path.indexOf(builder.toString()));
                path = new StringBuilder().append(parentPath).append(suffix.substring(1)).toString();
                if (paths.contains(path)) {
                    return;
                }
                ae.setPath(path);
                if (key.equals(ae.getApplicationId())) {
                    ae.setParentId(id);
                }
                ae.setRootId(rootId);
                ae.setHashcode(String.valueOf(path.hashCode()));
                ae.setId(null);
                applicationExplorationMapper.insertSelective(ae);
                paths.add(path);
            });
            if (paths.isEmpty()) {
                StringBuilder builder = new StringBuilder();
                String path =
                        builder.append(parentPath).append(key).append(SEPARATOR).toString();
                insert(id, rootId, key, path);
            }
        }
    }

    private Long getParentIdFromPath(Long applicationId, String path) {
        String[] array = path.split(SEPARATOR + applicationId + SEPARATOR);
        if (array.length == 0 || StringUtils.isEmpty(array[0])) {
            return null;
        } else {
            String str = array[0];
            return Long.valueOf(str.substring(str.lastIndexOf(SEPARATOR) + 1));
        }
    }

    private void insert(Long id, Long rootId, Long key, String path) {
        ApplicationExplorationDO ae = new ApplicationExplorationDO();
        ae.setApplicationId(key);
        ae.setPath(path);
        ae.setRootId(rootId);
        Long parentId = getParentIdFromPath(key, path);
        ae.setParentId(parentId == null ? id : parentId);
        ae.setHashcode(String.valueOf(path.hashCode()));
        applicationExplorationMapper.insertSelective(ae);
    }

    private Map<Long, String> getRootIdMap(Long id) {
        List<ApplicationExplorationDO> ancestors =
                applicationExplorationMapper.selectAncestorByApplicationId(id);
        //key是applicationId = id的应用的rootId，value为当前的路径
        Map<Long, String> map = new HashMap<>();
        ancestors.forEach(ancestor -> {
            if (id.equals(ancestor.getApplicationId())) {
                map.put(ancestor.getRootId(), ancestor.getPath());
            }
        });
        //如果没有祖先，则自己是root节点
        if (map.isEmpty()) {
            String path = SEPARATOR + id + SEPARATOR;
            map.put(id, path);
            ApplicationExplorationDO root = new ApplicationExplorationDO();
            root.setApplicationId(id);
            root.setPath(path);
            root.setRootId(id);
            if (applicationExplorationMapper.select(root).isEmpty()) {
                root.setHashcode(String.valueOf(path.hashCode()));
                applicationExplorationMapper.insertSelective(root);
            }
        }
        return map;
    }

    private Map<Long, List> canAddToCombination(Long id, Set<Long> idSet) {
        if (idSet.contains(id)) {
            throw new CommonException("error.application.add2combination.circle", id, id);
        }
        //查idSet的所有孩子节点，如果和id有重复的，则不能添加到组合
        Set<ApplicationExplorationDO> set = new HashSet<>();
        Map<Long, List> map = new HashMap<>(idSet.size());
        idSet.forEach(currentId -> {
            List<ApplicationExplorationDO> list =
                    applicationExplorationMapper.selectDescendantByApplicationId(currentId);
            map.put(currentId, list);
            set.addAll(list);
        });
        List<Long> illegalIds =
                set
                        .stream()
                        .filter(ae -> ae.getApplicationId().equals(id))
                        .map(ApplicationExplorationDO::getRootId)
                        .collect(Collectors.toList());
        if (!illegalIds.isEmpty()) {
            throw new CommonException("error.application.add2combination.circle", Arrays.toString(illegalIds.toArray()), id);
        }

        Set<Long> rootIds = new HashSet<>();
        rootIds.addAll(set.stream().map(ApplicationExplorationDO::getRootId).collect(Collectors.toList()));
        for (Map.Entry<Long, List> entry : map.entrySet()) {
            Long key = entry.getKey();
            List value = entry.getValue();
            List list = new ArrayList(2);
            //list.get(0)表示是不是root节点，list.get(1)是该节点的所有子节点
            list.add(rootIds.contains(key));
            list.add(value);
            entry.setValue(list);
        }
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
