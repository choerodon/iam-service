package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.excel.ExcelReadHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.event.producer.execute.EventProducerTemplate;
import io.choerodon.iam.api.dto.BatchImportResultDTO;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.api.dto.payload.OrganizationEventPayload;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.ListUtils;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author wuguokai
 */
@Component
public class OrganizationServiceImpl implements OrganizationService {

    private OrganizationRepository organizationRepository;

    private UserRepository userRepository;

    private OrganizationUserService organizationUserService;

    private final Logger logger = LoggerFactory.getLogger(OrganizationServiceImpl.class);

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private EventProducerTemplate eventProducerTemplate;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository,
                                   EventProducerTemplate eventProducerTemplate,
                                   UserRepository userRepository,
                                   OrganizationUserService organizationUserService) {
        this.organizationRepository = organizationRepository;
        this.eventProducerTemplate = eventProducerTemplate;
        this.userRepository = userRepository;
        this.organizationUserService = organizationUserService;
    }

    @Override
    public OrganizationDTO updateOrganization(Long organizationId, OrganizationDTO organizationDTO) {
        organizationDTO.setId(organizationId);
        //code不可更新
        organizationDTO.setCode(null);
        OrganizationE organizationE = ConvertHelper.convert(organizationDTO, OrganizationE.class);
        organizationE = organizationRepository.update(organizationE);
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO queryOrganizationById(Long organizationId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        return ConvertHelper.convert(organizationDO, OrganizationDTO.class);
    }

    @Override
    public Page<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, PageRequest pageRequest, String param) {
        Page<OrganizationDO> organizationDOPage =
                organizationRepository.pagingQuery(ConvertHelper.convert(
                        organizationDTO, OrganizationDO.class), pageRequest, param);
        return ConvertPageHelper.convertPage(organizationDOPage, OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO enableOrganization(Long organizationId) {
        OrganizationE organization =
                ConvertHelper.convert(organizationRepository.selectByPrimaryKey(organizationId), OrganizationE.class);
        if (organization == null) {
            throw new CommonException("error.organization.not.exist");
        }
        organization.enable();
        OrganizationE organizationE = updateAndSendEvent(organization, "enableOrganization");
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    @Override
    public OrganizationDTO disableOrganization(Long organizationId) {
        OrganizationE organization =
                ConvertHelper.convert(organizationRepository.selectByPrimaryKey(organizationId), OrganizationE.class);
        if (organization == null) {
            throw new CommonException("error.organization.not.exist");
        }
        organization.disable();
        OrganizationE organizationE = updateAndSendEvent(organization, "disableOrganization");
        return ConvertHelper.convert(organizationE, OrganizationDTO.class);
    }

    private OrganizationE updateAndSendEvent(OrganizationE organization, String consumerType) {
        OrganizationE organizationE;
        if (devopsMessage) {
            organizationE = new OrganizationE();
            OrganizationEventPayload payload = new OrganizationEventPayload();
            payload.setOrganizationId(organization.getId());
            Exception exception = eventProducerTemplate.execute("organization", consumerType,
                    serviceName, payload,
                    (String uuid) ->
                        BeanUtils.copyProperties(organizationRepository.update(organization), organizationE)
                    );
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            organizationE = organizationRepository.update(organization);
        }
        return organizationE;
    }

    @Override
    public void check(OrganizationDTO organization) {
        Boolean checkCode = !StringUtils.isEmpty(organization.getCode());
        if (!checkCode) {
            throw new CommonException("error.organization.code.empty");
        } else {
            checkCode(organization);
        }
    }

    @Override
    public BatchImportResultDTO importUsersFromExcel(Long id, MultipartFile multipartFile) {
        BatchImportResultDTO batchImportResult = new BatchImportResultDTO();
        batchImportResult.setSuccess(0);
        batchImportResult.setFailed(0);
        batchImportResult.setFailedUsers(new ArrayList<>());
        List<UserDO> insertUsers = new ArrayList<>();
        try {
            List<UserDO> users = ExcelReadHelper.read(multipartFile, UserDO.class, null);
            users.forEach(u -> {
                u.setOrganizationId(id);
                processUsers(u, batchImportResult, insertUsers);
            });
        } catch (IOException | IllegalAccessException | InstantiationException | InvocationTargetException e) {
            logger.info("something wrong was happened when reading the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.read");
        }
        List<List<UserDO>> list = ListUtils.subList(insertUsers, 1000);
        list.forEach(l -> {
            if (!l.isEmpty()) {
                organizationUserService.batchCreateUsers(l);
            }
        });
        return batchImportResult;
    }

    private void processUsers(UserDO user, BatchImportResultDTO batchImportResult, List<UserDO> insertUsers) {
        String loginName = user.getLoginName();
        String email = user.getEmail();
        if (loginNameIsExisted(loginName)) {
            batchImportResult.failedIncrement();
            batchImportResult.getFailedUsers().add(ConvertHelper.convert(user, UserDTO.class));
        } else if (emailIsExisted(email)) {
            batchImportResult.failedIncrement();
            batchImportResult.getFailedUsers().add(ConvertHelper.convert(user, UserDTO.class));
        } else {
            batchImportResult.successIncrement();
            insertUsers.add(user);
        }
        //excel中用户密码为空，设置默认密码为000000
        if (StringUtils.isEmpty(user.getPassword())) {
            user.setPassword("000000");
        }
        //加密
        user.setPassword(ENCODER.encode(user.getPassword()));
        if (StringUtils.isEmpty(user.getLanguage())) {
            user.setLanguage("zh_CN");
        }
        if (StringUtils.isEmpty(user.getTimeZone())) {
            user.setTimeZone("CTT");
        }
        user.setLastPasswordUpdatedAt(new Date(System.currentTimeMillis()));
        user.setEnabled(true);
        user.setLocked(false);
        user.setLdap(false);
        user.setAdmin(false);
    }

    private boolean emailIsExisted(String email) {
        UserDO userDO = new UserDO();
        userDO.setEmail(email);
        return userRepository.selectOne(userDO) != null;
    }

    private boolean loginNameIsExisted(String loginName) {
        UserDO userDO = new UserDO();
        userDO.setLoginName(loginName);
        return userRepository.selectOne(userDO) != null;
    }

    private void checkCode(OrganizationDTO organization) {
        Boolean createCheck = StringUtils.isEmpty(organization.getId());
        String code = organization.getCode();
        OrganizationDO organizationDO = new OrganizationDO();
        organizationDO.setCode(code);
        if (createCheck) {
            Boolean existed = organizationRepository.selectOne(organizationDO) != null;
            if (existed) {
                throw new CommonException("error.organization.code.exist");
            }
        } else {
            Long id = organization.getId();
            OrganizationDO organizationDO1 = organizationRepository.selectOne(organizationDO);
            Boolean existed = organizationDO1 != null && !id.equals(organizationDO1.getId());
            if (existed) {
                throw new CommonException("error.organization.code.exist");
            }
        }
    }
}
