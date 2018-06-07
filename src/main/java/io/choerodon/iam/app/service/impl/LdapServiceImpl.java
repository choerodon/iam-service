package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.LdapAccountDTO;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.LdapHistoryDTO;
import io.choerodon.iam.api.validator.LdapValidator;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.domain.oauth.entity.LdapE;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.repository.LdapRepository;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask;
import io.choerodon.iam.infra.common.utils.ldap.LdapUtil;
import io.choerodon.iam.infra.dataobject.LdapDO;
import org.springframework.stereotype.Component;

import javax.naming.ldap.LdapContext;

/**
 * @author wuguokai
 */
@Component
public class LdapServiceImpl implements LdapService {
    private LdapRepository ldapRepository;
    private ILdapService iLdapService;
    private OrganizationRepository organizationRepository;
    private LdapSyncUserTask ldapSyncUserTask;
    private LdapSyncUserTask.FinishFallback finishFallback;
    private LdapHistoryRepository ldapHistoryRepository;
    private static final String ORGANIZATION_NOT_EXIST_EXCEPTION = "error.organization.not.exist";
    private static final String LDAP_NOT_EXIST_EXCEPTION = "error.ldap.not.exist";

    public LdapServiceImpl(LdapRepository ldapRepository, OrganizationRepository organizationRepository,
                           LdapSyncUserTask ldapSyncUserTask, ILdapService iLdapService,
                           LdapSyncUserTask.FinishFallback finishFallback,
                           LdapHistoryRepository ldapHistoryRepository) {
        this.ldapRepository = ldapRepository;
        this.organizationRepository = organizationRepository;
        this.ldapSyncUserTask = ldapSyncUserTask;
        this.iLdapService = iLdapService;
        this.finishFallback = finishFallback;
        this.ldapHistoryRepository = ldapHistoryRepository;
    }

    @Override
    public LdapDTO create(Long orgId, LdapDTO ldapDTO) {
        if (organizationRepository.selectByPrimaryKey(orgId) == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        ldapDTO.setOrganizationId(orgId);
        LdapE ldapE = ldapRepository.create(ConvertHelper.convert(ldapDTO, LdapE.class));
        return ConvertHelper.convert(ldapE, LdapDTO.class);
    }

    @Override
    public LdapDTO update(Long organizationId, Long id, LdapDTO ldapDTO) {
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
        //todo ldap password 加密解密
        ldap.setPassword(ldapAccount.getPassword());
        return iLdapService.testConnect(ldap);
    }

    @Override
    public void syncLdapUser(Long organizationId, Long id) {
        LdapDO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException("error.ldap.not.exist");
        }
        LdapValidator.validate(ldap);
        //匿名用户
        boolean anonymous = ldap.getAccount() == null || ldap.getPassword() == null;
        LdapContext ldapContext = null;
        LdapConnectionDTO ldapConnectionDTO = new LdapConnectionDTO();
        if (anonymous) {
            //匿名用户只连接
            ldapContext =LdapUtil.ldapConnect(ldap.getServerAddress(), ldap.getBaseDn(), ldap.getPort(), ldap.getUseSSL());
            if (ldapContext == null) {
                throw new CommonException("error.ldap.connect");
            }
            iLdapService.anonymousUserMatchAttributeTesting(ldapContext, ldapConnectionDTO, ldap);
        } else {
            //非匿名用户登陆
            ldapContext = LdapUtil.authenticate(ldap.getAccount(), ldap.getPassword(), ldap);
            if (ldapContext == null) {
                throw new CommonException("error.ldap.connect");
            }
            //匹配属性
            iLdapService.matchAttributeTesting(ldapContext, ldapConnectionDTO, ldap);
        }
        if (!ldapConnectionDTO.getMatchAttribute()) {
            throw new CommonException("error.ldap.attribute.match");
        }
        ldapSyncUserTask.syncLDAPUser(ldapContext, ldap, anonymous, finishFallback);
    }

    @Override
    public LdapHistoryDTO queryLatestHistory(Long id) {
        return ConvertHelper.convert(ldapHistoryRepository.queryLatestHistory(id), LdapHistoryDTO.class);
    }

    @Override
    public LdapDTO enableLdap(Long organizationId, Long id) {
        LdapDO ldap = ldapRepository.queryById(id);
        if (ldap == null) {
            throw new CommonException("error.ldap.not.exist");
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
            throw new CommonException("error.ldap.not.exist");
        }
        if (!ldap.getOrganizationId().equals(organizationId)) {
            throw new CommonException("error.ldap.organizationId.not.match");
        }
        ldap.setEnabled(false);
        return ConvertHelper.convert(ldapRepository.update(ldap.getId(), ldap), LdapDTO.class);
    }
}
