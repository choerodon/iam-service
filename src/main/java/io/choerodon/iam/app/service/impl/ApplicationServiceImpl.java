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
import io.choerodon.iam.app.service.ApplicationService;
import io.choerodon.iam.infra.common.utils.AssertHelper;
import io.choerodon.iam.infra.dataobject.ApplicationDO;
import io.choerodon.iam.infra.enums.ApplicationCategory;
import io.choerodon.iam.infra.enums.ApplicationType;
import io.choerodon.iam.infra.mapper.ApplicationMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * @author superlee
 * @since 0.15.0
 */
@Service
public class ApplicationServiceImpl implements ApplicationService {

    private ApplicationMapper applicationMapper;

    private AssertHelper assertHelper;

    private TransactionalProducer producer;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    private final ModelMapper modelMapper = new ModelMapper();

    public ApplicationServiceImpl(ApplicationMapper applicationMapper,
                                  AssertHelper assertHelper,
                                  TransactionalProducer producer) {
        this.applicationMapper = applicationMapper;
        this.assertHelper = assertHelper;
        this.producer = producer;
    }

    @Override
    @Saga(code = APP_CREATE, description = "iam创建应用", inputSchemaClass = ApplicationDO.class)
    public ApplicationDTO create(ApplicationDTO applicationDTO) {
        assertHelper.organizationNotExisted(applicationDTO.getOrganizationId());
        validate(applicationDTO);
        //application-group不能选项目
        if (ApplicationCategory.GROUP.code().equals(applicationDTO.getApplicationCategory())) {
            applicationDTO.setProjectId(null);
        }
        ApplicationDO applicationDO = modelMapper.map(applicationDTO, ApplicationDO.class);
        Long projectId = applicationDO.getProjectId();
        if (projectId != null) {
            assertHelper.projectNotExisted(projectId);
        }

        ApplicationDO result;
        if (devopsMessage && projectId != null) {
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
        Long originProjectId = applicationDTO.getProjectId();
        validate(applicationDTO);
        preUpdate(applicationDTO);
        ApplicationDO applicationDO = modelMapper.map(applicationDTO, ApplicationDO.class);
        Long projectId = applicationDO.getProjectId();
        boolean sendCreateEvent = (projectId != null);

        ApplicationDO result;
        if (devopsMessage) {
            if (originProjectId != null && sendCreateEvent) {
                //项目id第一次选择，发送创建事件
                result = sendEvent(applicationDO, APP_CREATE);
            } else if (originProjectId == null && sendCreateEvent) {
                //如果没有更新projectId,不发事件
                result = doUpdate(applicationDO);
            } else {
                result = sendEvent(applicationDO, APP_UPDATE);
            }
        } else {
            result = doUpdate(applicationDO);
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
        ApplicationDO applicationDO = assertHelper.applicationNotExisted(id);
        applicationDO.setEnabled(true);
        if (devopsMessage && applicationDO.getProjectId() != null) {
            return modelMapper.map(sendEvent(applicationDO, APP_ENABLE), ApplicationDTO.class);
        } else {
            return modelMapper.map(doUpdate(applicationDO), ApplicationDTO.class);
        }
    }

    @Override
    @Saga(code = APP_DISABLE, description = "iam禁用应用", inputSchemaClass = ApplicationDO.class)
    public ApplicationDTO disable(Long id) {
        ApplicationDO applicationDO = assertHelper.applicationNotExisted(id);
        applicationDO.setEnabled(false);
        if (devopsMessage && applicationDO.getProjectId() != null) {
            return modelMapper.map(sendEvent(applicationDO, APP_DISABLE), ApplicationDTO.class);
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
        checkName(applicationDTO);
        checkCode(applicationDTO);
    }

    private void checkCode(ApplicationDTO applicationDTO) {
        String code = applicationDTO.getCode();
        ApplicationDO example = new ApplicationDO();
        example.setCode(code);
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
            ApplicationDO applicationDO = applicationMapper.selectOne(example);
            if (applicationDO != null && !applicationDO.getId().equals(id)) {
                throw new CommonException(message);
            }
        }
    }

    private void checkName(ApplicationDTO applicationDTO) {
        String name = applicationDTO.getName();
        ApplicationDO example = new ApplicationDO();
        example.setName(name);
        Long id = applicationDTO.getId();
        check(example, id, "error.application.name.duplicate");
    }


    private boolean preUpdate(ApplicationDTO applicationDTO) {
        ApplicationDO applicationDO = assertHelper.applicationNotExisted(applicationDTO.getId());
        Long projectId = applicationDTO.getProjectId();
        boolean canUpdateProject = ObjectUtils.isEmpty(applicationDO.getProjectId());
        if (!canUpdateProject) {
            applicationDTO.setProjectId(null);
        } else if (applicationDTO.getProjectId() != null) {
            assertHelper.projectNotExisted(projectId);
        }
        applicationDTO.setOrganizationId(null).setApplicationCategory(null).setCode(null);
        assertHelper.objectVersionNumberNotNull(applicationDTO.getObjectVersionNumber());
        return canUpdateProject;
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
