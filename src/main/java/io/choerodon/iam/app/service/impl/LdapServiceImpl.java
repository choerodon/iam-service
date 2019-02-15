package io.choerodon.iam.app.service.impl;

import java.util.Date;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.api.validator.LdapValidator;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.domain.oauth.entity.LdapE;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.repository.LdapRepository;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.domain.service.impl.ILdapServiceImpl;
import io.choerodon.iam.infra.common.utils.LocaleUtils;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask;
import io.choerodon.iam.infra.dataobject.LdapDO;

import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.factory.MessageSourceFactory;
import io.choerodon.iam.infra.mapper.LdapErrorUserMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
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
        LdapE ldapE = ldapRepository.create(ConvertHelper.convert(ldapDTO, LdapE.class));
        return ConvertHelper.convert(ldapE, LdapDTO.class);
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
        LdapDO ldapDO = ldapRepository.update(id, ConvertHelper.convert(ldapDTO, LdapDO.class));
        return ConvertHelper.convert(ldapDO, LdapDTO.class);
    }

    @Override
    public LdapDTO queryByOrganizationId(Long orgId) {
        if (organizationRepository.selectByPrimaryKey(orgId) == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        LdapDO ldapDO = ldapRepository.queryByOrgId(orgId);
        if (ldapDO == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        return ConvertHelper.convert(ldapDO, LdapDTO.class);
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
        LdapDO ldap = ldapRepository.queryById(id);
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
        LdapDO ldap = validateLdap(organizationId, id);
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
        ldapSyncUserTask.syncLDAPUser(ldapTemplate, ldap, finishFallback);
    }

    @Override
    public LdapDO validateLdap(Long organizationId, Long id) {
        if (organizationRepository.selectByPrimaryKey(organizationId) == null) {
            throw new CommonException("error.organization.notFound");
        }
        LdapDO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        LdapValidator.validate(ldap);
        return ldap;
    }

    @Override
    public LdapHistoryDTO queryLatestHistory(Long ldapId) {
        return ConvertHelper.convert(ldapHistoryRepository.queryLatestHistory(ldapId), LdapHistoryDTO.class);
    }

    @Override
    public LdapDTO enableLdap(Long organizationId, Long id) {
        LdapDO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        if (!ldap.getOrganizationId().equals(organizationId)) {
            throw new CommonException("error.ldap.organizationId.not.match");
        }
        ldap.setEnabled(true);
        return ConvertHelper.convert(ldapRepository.update(ldap.getId(), ldap), LdapDTO.class);
    }

    @Override
    public LdapDTO disableLdap(Long organizationId, Long id) {
        LdapDO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException(LDAP_NOT_EXIST_EXCEPTION);
        }
        if (!ldap.getOrganizationId().equals(organizationId)) {
            throw new CommonException("error.ldap.organizationId.not.match");
        }
        ldap.setEnabled(false);
        return ConvertHelper.convert(ldapRepository.update(ldap.getId(), ldap), LdapDTO.class);
    }

    @Override
    public LdapHistoryDTO stop(Long id) {
        LdapHistoryDO ldapHistoryDO = ldapHistoryRepository.queryLatestHistory(id);
        ldapHistoryDO.setSyncEndTime(new Date(System.currentTimeMillis()));
        return ConvertHelper.convert(ldapHistoryRepository.updateByPrimaryKeySelective(ldapHistoryDO), LdapHistoryDTO.class);
    }

    @Override
    public Page<LdapHistoryDTO> pagingQueryHistories(PageRequest pageRequest, Long ldapId) {
        return ldapHistoryRepository.pagingQuery(pageRequest, ldapId);
    }

    @Override
    public Page<LdapErrorUserDTO> pagingQueryErrorUsers(PageRequest pageRequest, Long ldapHistoryId, LdapErrorUserDTO ldapErrorUserDTO) {
        Page<LdapErrorUserDTO> dtos =
                ConvertPageHelper.convertPage(PageHelper.doPageAndSort(pageRequest,
                        () -> ldapErrorUserMapper.fuzzyQuery(ldapHistoryId, ldapErrorUserDTO)), LdapErrorUserDTO.class);
        //cause国际化处理
        List<LdapErrorUserDTO> errorUsers = dtos.getContent();
        MessageSource messageSource = MessageSourceFactory.create(LDAP_ERROR_USER_MESSAGE_DIR);
        Locale locale = LocaleUtils.locale();
        errorUsers.forEach(errorUser -> {
            String cause = errorUser.getCause();
            errorUser.setCause(messageSource.getMessage(cause, null, locale));
        });
        return dtos;
    }
}
