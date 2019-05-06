package io.choerodon.iam.app.service.impl;

import java.util.Date;
import java.util.Map;
import java.util.regex.Pattern;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.LdapAccountDTO;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.infra.dto.LdapDTO;
import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dto.LdapHistoryDTO;
import io.choerodon.iam.infra.enums.LdapSyncType;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.validator.LdapValidator;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.repository.LdapRepository;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.domain.service.impl.ILdapServiceImpl;
import io.choerodon.iam.infra.common.utils.LocaleUtils;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask;

import io.choerodon.iam.infra.factory.MessageSourceFactory;
import io.choerodon.iam.infra.mapper.LdapErrorUserMapper;
import org.springframework.context.MessageSource;

import java.util.List;
import java.util.Locale;

/**
 * @author wuguokai
 */
@Component
public class LdapServiceImpl implements LdapService {
    private static final String ORGANIZATION_NOT_EXIST_EXCEPTION = "error.organization.not.exist";
    private static final String LDAP_NOT_EXIST_EXCEPTION = "error.ldap.not.exist";
    private static final String LDAP_ERROR_USER_MESSAGE_DIR = "classpath:messages/messages";
    private LdapRepository ldapRepository;
    private ILdapService iLdapService;
    private OrganizationRepository organizationRepository;
    private LdapSyncUserTask ldapSyncUserTask;
    private LdapSyncUserTask.FinishFallback finishFallback;
    private LdapHistoryRepository ldapHistoryRepository;
    private LdapErrorUserMapper ldapErrorUserMapper;

    public LdapServiceImpl(LdapRepository ldapRepository, OrganizationRepository organizationRepository,
                           LdapSyncUserTask ldapSyncUserTask, ILdapService iLdapService,
                           LdapSyncUserTask.FinishFallback finishFallback,
                           LdapHistoryRepository ldapHistoryRepository,
                           LdapErrorUserMapper ldapErrorUserMapper) {
        this.ldapRepository = ldapRepository;
        this.organizationRepository = organizationRepository;
        this.ldapSyncUserTask = ldapSyncUserTask;
        this.iLdapService = iLdapService;
        this.finishFallback = finishFallback;
        this.ldapHistoryRepository = ldapHistoryRepository;
        this.ldapErrorUserMapper = ldapErrorUserMapper;
    }

    @Override
    public LdapDTO create(Long orgId, LdapDTO ldapDTO) {
        if (organizationRepository.selectByPrimaryKey(orgId) == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        ldapDTO.setOrganizationId(orgId);
        validateLdap(ldapDTO);
        return ldapRepository.create(ldapDTO);
    }

    private void validateLdap(LdapDTO ldapDTO) {
        String customFilter = ldapDTO.getCustomFilter();
        if (!StringUtils.isEmpty(customFilter) && !Pattern.matches("\\(.*\\)", customFilter)) {
            throw new CommonException("error.ldap.customFilter");
        }
        if (ldapDTO.getSagaBatchSize() < 1) {
            ldapDTO.setSagaBatchSize(1);
        }
        if (ldapDTO.getConnectionTimeout() < 1) {
            throw new CommonException("error.ldap.connectionTimeout");
        }
    }

    @Override
    public LdapDTO update(Long organizationId, Long id, LdapDTO ldapDTO) {
        validateLdap(ldapDTO);
        if (organizationRepository.selectByPrimaryKey(organizationId) == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        if (ldapRepository.queryById(id) == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        return ldapRepository.update(id, ldapDTO);
    }

    @Override
    public LdapDTO queryByOrganizationId(Long orgId) {
        if (organizationRepository.selectByPrimaryKey(orgId) == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        LdapDTO ldapDTO = ldapRepository.queryByOrgId(orgId);
        if (ldapDTO == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        return ldapDTO;
    }

    @Override
    public Boolean delete(Long orgId, Long id) {
        if (organizationRepository.selectByPrimaryKey(orgId) == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        if (ldapRepository.queryById(id) == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        return ldapRepository.delete(id);
    }

    @Override
    public LdapConnectionDTO testConnect(Long organizationId, Long id, LdapAccountDTO ldapAccount) {
        if (organizationRepository.selectByPrimaryKey(organizationId) == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        LdapDTO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        if (!organizationId.equals(ldap.getOrganizationId())) {
            throw new CommonException("error.organization.not.has.ldap", organizationId, id);
        }
        ldap.setAccount(ldapAccount.getAccount());
        ldap.setPassword(ldapAccount.getPassword());
        return (LdapConnectionDTO) iLdapService.testConnect(ldap).get(ILdapServiceImpl.LDAP_CONNECTION_DTO);
    }

    @Override
    public void syncLdapUser(Long organizationId, Long id) {
        LdapDTO ldap = validateLdap(organizationId, id);
        Map<String, Object> map = iLdapService.testConnect(ldap);
        LdapConnectionDTO ldapConnectionDTO =
                (LdapConnectionDTO) map.get(ILdapServiceImpl.LDAP_CONNECTION_DTO);
        if (!ldapConnectionDTO.getCanConnectServer()) {
            throw new CommonException("error.ldap.connect");
        }
        if (!ldapConnectionDTO.getCanLogin()) {
            throw new CommonException("error.ldap.authenticate");
        }
        if (!ldapConnectionDTO.getMatchAttribute()) {
            throw new CommonException("error.ldap.attribute.match");
        }
        LdapTemplate ldapTemplate = (LdapTemplate) map.get(ILdapServiceImpl.LDAP_TEMPLATE);
        ldapSyncUserTask.syncLDAPUser(ldapTemplate, ldap, LdapSyncType.SYNC.value(), finishFallback);
    }

    @Override
    public LdapDTO validateLdap(Long organizationId, Long id) {
        if (organizationRepository.selectByPrimaryKey(organizationId) == null) {
            throw new CommonException("error.organization.notFound");
        }
        LdapDTO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        LdapValidator.validate(ldap);
        return ldap;
    }

    @Override
    public LdapHistoryDTO queryLatestHistory(Long ldapId) {
        return ldapHistoryRepository.queryLatestHistory(ldapId);
    }

    @Override
    public LdapDTO enableLdap(Long organizationId, Long id) {
        LdapDTO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        if (!ldap.getOrganizationId().equals(organizationId)) {
            throw new CommonException("error.ldap.organizationId.not.match");
        }
        ldap.setEnabled(true);
        return ldapRepository.update(ldap.getId(), ldap);
    }

    @Override
    public LdapDTO disableLdap(Long organizationId, Long id) {
        LdapDTO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        if (!ldap.getOrganizationId().equals(organizationId)) {
            throw new CommonException("error.ldap.organizationId.not.match");
        }
        ldap.setEnabled(false);
        return ldapRepository.update(ldap.getId(), ldap);
    }

    @Override
    public LdapHistoryDTO stop(Long id) {
        LdapHistoryDTO ldapHistoryDTO = ldapHistoryRepository.queryLatestHistory(id);
        ldapHistoryDTO.setSyncEndTime(new Date(System.currentTimeMillis()));
        return ldapHistoryRepository.updateByPrimaryKeySelective(ldapHistoryDTO);
    }

    @Override
    public PageInfo<LdapHistoryDTO> pagingQueryHistories(int page, int size, Long ldapId) {
        return ldapHistoryRepository.pagingQuery(page, size, ldapId);
    }

    @Override
    public PageInfo<LdapErrorUserDTO> pagingQueryErrorUsers(int page, int size, Long ldapHistoryId, LdapErrorUserDTO ldapErrorUserDTO) {
        PageInfo<LdapErrorUserDTO> result =
                PageHelper.startPage(page, size).doSelectPageInfo(() -> ldapErrorUserMapper.fuzzyQuery(ldapHistoryId, ldapErrorUserDTO));
        //cause国际化处理
        List<LdapErrorUserDTO> errorUsers = result.getList();
        MessageSource messageSource = MessageSourceFactory.create(LDAP_ERROR_USER_MESSAGE_DIR);
        Locale locale = LocaleUtils.locale();
        errorUsers.forEach(errorUser -> {
            String cause = errorUser.getCause();
            errorUser.setCause(messageSource.getMessage(cause, null, locale));
        });
        return result;
    }
}
