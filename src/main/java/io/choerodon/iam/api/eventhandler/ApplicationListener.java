package io.choerodon.iam.api.eventhandler;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.payload.DevOpsAppSyncPayload;
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper;
import io.choerodon.iam.infra.asserts.ProjectAssertHelper;
import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.choerodon.iam.infra.dto.ApplicationExplorationDTO;
import io.choerodon.iam.infra.enums.ApplicationCategory;
import io.choerodon.iam.infra.enums.ApplicationType;
import io.choerodon.iam.infra.mapper.ApplicationExplorationMapper;
import io.choerodon.iam.infra.mapper.ApplicationMapper;

/**
 * 应用监听器
 *
 * @since 0.15.0
 */
@Component
public class ApplicationListener {

    private static final String SUCCESSFUL = "successful";
    private static final String FAILED = "failed";
    private static final String SEPARATOR = "/";

    private final Logger logger = LoggerFactory.getLogger(ApplicationListener.class);

    private ObjectMapper objectMapper = new ObjectMapper();

    private ApplicationMapper applicationMapper;
    private ApplicationExplorationMapper applicationExplorationMapper;

    private OrganizationAssertHelper organizationAssertHelper;

    private ProjectAssertHelper projectAssertHelper;

    public ApplicationListener(ApplicationMapper applicationMapper,
                               ApplicationExplorationMapper applicationExplorationMapper,
                               OrganizationAssertHelper organizationAssertHelper,
                               ProjectAssertHelper projectAssertHelper) {
        this.applicationMapper = applicationMapper;
        this.applicationExplorationMapper = applicationExplorationMapper;
        this.organizationAssertHelper = organizationAssertHelper;
        this.projectAssertHelper = projectAssertHelper;
    }

    @SagaTask(code = IAM_SYNC_APP, sagaCode = APP_SYNC, seq = 1, description = "devops发送application集合进行同步")
    public void syncApplications(String message) throws IOException {
        List<ApplicationDTO> applications = objectMapper.readValue(message, new TypeReference<List<ApplicationDTO>>() {
        });
        logger.info("begin to sync applications, total: {}", applications.size());
        if (applications.isEmpty()) {
            logger.warn("receiving no one application while syncing applications");
            return;
        }
        Map<String, Integer> statisticsMap = new HashMap<>(2);
        statisticsMap.put(SUCCESSFUL, 0);
        statisticsMap.put(FAILED, 0);
        applications.forEach(app -> {
            int successful = statisticsMap.get(SUCCESSFUL);
            int failed = statisticsMap.get(FAILED);
            if (isIllegal(app)) {
                statisticsMap.put(FAILED, ++failed);
                return;
            }
            try {
                applicationMapper.insertSelective(app);
                long appId = app.getId();
                ApplicationExplorationDTO example = new ApplicationExplorationDTO();
                example.setApplicationId(appId);
                String path = SEPARATOR + appId + SEPARATOR;
                example.setPath(path);
                example.setRootId(appId);
                example.setHashcode(String.valueOf(path.hashCode()));
                example.setEnabled(true);
                applicationExplorationMapper.insertSelective(example);
                statisticsMap.put(SUCCESSFUL, ++successful);
            } catch (Exception e) {
                statisticsMap.put(FAILED, ++failed);
                logger.error("insert application into db failed, application: {}, exception: {} ", app, e);
            }
        });
        logger.info("syncing applications has done, successful: {}, failed: {}", statisticsMap.get(SUCCESSFUL), statisticsMap.get(FAILED));
    }

    private boolean isIllegal(ApplicationDTO app) {
        Long organizationId = app.getOrganizationId();
        if (ObjectUtils.isEmpty(organizationId)) {
            logger.error("illegal application because of organization id is empty, application: {}", app);
        } else {
            try {
                organizationAssertHelper.organizationNotExisted(organizationId);
            } catch (CommonException e) {
                logger.error("illegal application because of organization does not existed, application: {}", app);
                return true;
            }
        }

        Long projectId = app.getProjectId();
        if (ObjectUtils.isEmpty(projectId)) {
            logger.error("illegal application because of project id is empty, application: {}", app);
        } else {
            try {
                projectAssertHelper.projectNotExisted(projectId);
            } catch (CommonException e) {
                logger.error("illegal application because of project does not existed, application: {}", app);
                return true;
            }
        }

        String name = app.getName();
        if (StringUtils.isEmpty(name)) {
            logger.error("illegal application because of name is empty, application: {}", app);
            return true;
        }

        String code = app.getCode();
        if (StringUtils.isEmpty(code)) {
            logger.error("illegal application because of code is empty, application: {}", app);
            return true;
        }

        if (!ApplicationType.matchCode(app.getApplicationType())) {
            logger.error("illegal application because of type is illegal, application: {}", app);
            return true;
        }
        ApplicationDTO example = new ApplicationDTO();
        example.setName(name);
        example.setOrganizationId(organizationId);
        example.setProjectId(projectId);
        if (!applicationMapper.select(example).isEmpty()) {
            logger.error("illegal application because of name is duplicated, application: {}", app);
            return true;
        }
        example.setName(null);
        example.setCode(code);
        if (!applicationMapper.select(example).isEmpty()) {
            logger.error("illegal application because of code is duplicated, application: {}", app);
            return true;
        }


        if (ObjectUtils.isEmpty(app.getEnabled())) {
            logger.warn("the enabled of application is null, so set default value true, application: {}", app);
            app.setEnabled(true);
        }
        app.setApplicationCategory(ApplicationCategory.APPLICATION.code());
        return false;
    }

    @SagaTask(code = APP_UPDATE_ABNORMAL, sagaCode = APP_DEVOPS_CREATE_FAIL, seq = 1, description = "iam接收devops创建应用失败事件")
    public void updateApplicationAbnormal(String message) throws IOException {
        ApplicationDTO applicationDTO = objectMapper.readValue(message, ApplicationDTO.class);
        if (applicationDTO == null) {
            throw new CommonException("error.application.payload.empty");
        }
        long id = applicationDTO.getId();
        ApplicationDTO application = applicationMapper.selectByPrimaryKey(id);
        if (application == null) {
            throw new CommonException("error.application.not.exist", applicationDTO);
        }
        application.setAbnormal(true);
        applicationMapper.updateByPrimaryKey(application);
    }

    @SagaTask(code = APP_SYNC_DELETE, sagaCode = DEVOPS_APP_DELETE, seq = 1, description = "iam接收devops删除应用事件")
    public void syncDeleteApplication(String message) throws IOException {
        DevOpsAppSyncPayload appDelPayload = getPayload(message);
        validatePayload(appDelPayload, false, false);
        ApplicationDTO applicationDTO = getTargetApplicationByUniqueIndex(appDelPayload);
        applicationExplorationMapper.deleteDescendantByApplicationId(applicationDTO.getId());
        applicationMapper.deleteByPrimaryKey(applicationDTO);
    }

    @SagaTask(code = APP_SYNC_ACTIVE, sagaCode = DEVOPS_SYNC_APP_ACTIVE, seq = 1, description = "iam接收devops启用、禁用应用事件")
    public void syncApplicationActiveStatus(String message) throws IOException {
        DevOpsAppSyncPayload devOpsAppSyncPayload = getPayload(message);
        validatePayload(devOpsAppSyncPayload, true, false);
        ApplicationDTO applicationDTO = getTargetApplicationByUniqueIndex(devOpsAppSyncPayload);
        applicationDTO.setEnabled(devOpsAppSyncPayload.getActive());
        applicationMapper.updateByPrimaryKeySelective(applicationDTO);
    }

    @SagaTask(code = APP_SYNC_NAME, sagaCode = DEVOPS_SYNC_APP_NAME, seq = 1, description = "iam接收devops更新应用名称事件")
    public void syncApplicationName(String message) throws IOException {
        DevOpsAppSyncPayload syncPayload = getPayload(message);
        validatePayload(syncPayload, false, true);
        ApplicationDTO applicationDTO = getTargetApplicationByUniqueIndex(syncPayload);
        applicationDTO.setName(syncPayload.getName());
        applicationMapper.updateByPrimaryKeySelective(applicationDTO);
    }

    private DevOpsAppSyncPayload getPayload(String message) throws IOException {
        DevOpsAppSyncPayload devOpsAppSyncPayload = objectMapper.readValue(message, DevOpsAppSyncPayload.class);
        if (devOpsAppSyncPayload == null) {
            throw new CommonException("error.application.payload.empty");
        }
        return devOpsAppSyncPayload;
    }

    private void validatePayload(DevOpsAppSyncPayload devOpsAppSyncPayload, boolean activeValidate, boolean nameValidate) {
        if (devOpsAppSyncPayload.getCode() == null) {
            throw new CommonException("error.application.code.empty", devOpsAppSyncPayload);
        }
        if (devOpsAppSyncPayload.getProjectId() == null) {
            throw new CommonException("error.application.projectId.empty", devOpsAppSyncPayload);
        }
        if (devOpsAppSyncPayload.getOrganizationId() == null) {
            throw new CommonException("error.application.organizationId.empty", devOpsAppSyncPayload);
        }
        if (activeValidate && devOpsAppSyncPayload.getActive() == null) {
            throw new CommonException("error.application.name.empty", devOpsAppSyncPayload);
        }
        if (nameValidate && devOpsAppSyncPayload.getName() == null) {
            throw new CommonException("error.application.name.empty", devOpsAppSyncPayload);
        }
    }

    private ApplicationDTO getTargetApplicationByUniqueIndex(DevOpsAppSyncPayload syncPayload) {
        ApplicationDTO applicationDTO = new ApplicationDTO();
        applicationDTO.setCode(syncPayload.getCode());
        applicationDTO.setProjectId(syncPayload.getProjectId());
        applicationDTO.setOrganizationId(syncPayload.getOrganizationId());
        applicationDTO = applicationMapper.selectOne(applicationDTO);
        if (applicationDTO == null) {
            throw new CommonException("error.application.not.exist", syncPayload);
        }
        return applicationDTO;
    }

}
