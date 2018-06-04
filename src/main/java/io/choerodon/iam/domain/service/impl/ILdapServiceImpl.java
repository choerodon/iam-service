package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.infra.common.utils.ldap.LdapUtil;
import io.choerodon.iam.infra.dataobject.LdapDO;
import io.choerodon.mybatis.util.StringUtil;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.naming.Name;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.ldap.LdapContext;

/**
 * @author superlee
 */
@Service
public class ILdapServiceImpl implements ILdapService {

    @Override
    public LdapConnectionDTO testConnect(LdapDO ldap) {
        connectValidate(ldap);
//        LdapTemplate ldapTemplate = initLdapTemplate(ldap);
        LdapConnectionDTO ldapConnectionDTO = new LdapConnectionDTO();
        ldapConnectionDTO.setCanConnectServer(ConnectServerTesting(ldap));
        LdapContext ldapContext = LoginTesting(ldap);
//        DirContext dirContext = ldapTemplate.getContextSource().getReadOnlyContext();
        ldapConnectionDTO.setCanLogin(ldapContext != null);
        matchAttributeTesting(ldapContext, ldapConnectionDTO, ldap);
        return ldapConnectionDTO;
    }

//    private LdapTemplate initLdapTemplate(LdapDO ldap) {
//        LdapContextSource ldapContextSource = new LdapContextSource();
//        //如果port为空字符串，设置端口为默认389
//        String port = StringUtils.isEmpty(ldap.getPort()) ? "389": ldap.getPort();
//        String url = ldap.getServerAddress() + ":" + port + "/" + ldap.getBaseDn();
//        ldapContextSource.setUrl(url);
//        ldapContextSource.setBase(ldap.getBaseDn());
//        ldapContextSource.setUserDn(ldap.getAccount());
//        ldapContextSource.setPassword(ldap.getPassword());
//        ldapContextSource.afterPropertiesSet();
//        return new LdapTemplate(ldapContextSource);
//    }

    private void matchAttributeTesting(LdapContext ldapContext, LdapConnectionDTO ldapConnectionDTO,
                                       LdapDO ldap) {
        if (ldapContext == null) {
            //登陆不成功，匹配属性测试也是成功的
            ldapConnectionDTO.setMatchAttribute(false);
            ldapConnectionDTO.setEmailField(ldap.getEmailField());
            ldapConnectionDTO.setLoginNameField(ldap.getLoginNameField());
            ldapConnectionDTO.setPasswordField(ldap.getPasswordField());
            ldapConnectionDTO.setPhoneField(ldap.getPhoneField());
            ldapConnectionDTO.setUserNameField(ldap.getRealNameField());
        } else {
//            try {
//                ldapContext.geta
//            } catch (NamingException e) {
//                e.printStackTrace();
//            }
        }
    }

    private LdapContext LoginTesting(LdapDO ldap) {
        return LdapUtil.authenticate(ldap.getAccount(), ldap.getPassword(), ldap);
    }

    private boolean ConnectServerTesting(LdapDO ldap) {
        return LdapUtil.ldapConnect(ldap.getServerAddress(), ldap.getBaseDn(), ldap.getPort()) != null;
    }

    private void connectValidate(LdapDO ldap) {
        if (StringUtils.isEmpty(ldap.getServerAddress())) {
            throw new CommonException("error.ldap.serverAddress.empty");
        }
        if (StringUtils.isEmpty(ldap.getAccount())) {
            throw new CommonException("error.ldap.account.empty");
        }
        if (StringUtils.isEmpty(ldap.getPassword())) {
            throw new CommonException("error.ldap.password.empty");
        }
    }
}
