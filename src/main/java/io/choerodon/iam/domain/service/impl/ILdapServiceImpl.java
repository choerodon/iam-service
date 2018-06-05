package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.infra.common.utils.ldap.LdapUtil;
import io.choerodon.iam.infra.dataobject.LdapDO;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.naming.NamingEnumeration;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;
import java.util.HashSet;
import java.util.Set;

/**
 * @author superlee
 */
@Service
public class ILdapServiceImpl implements ILdapService {

    @Override
    public LdapConnectionDTO testConnect(LdapDO ldap) {
        connectValidate(ldap);
        LdapConnectionDTO ldapConnectionDTO = new LdapConnectionDTO();
        ldapConnectionDTO.setCanConnectServer(ConnectServerTesting(ldap));
        LdapContext ldapContext = LoginTesting(ldap);
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
            //登陆不成功，匹配属性测试也是失败的
            ldapConnectionDTO.setMatchAttribute(false);
        } else {
            Set<String> attributeSet = new HashSet<>();
            attributeSet.add(ldap.getLoginNameField());
            attributeSet.add(ldap.getRealNameField());
            attributeSet.add(ldap.getEmailField());
            attributeSet.add(ldap.getPasswordField());
            attributeSet.add(ldap.getPhoneField());
            Set<String> keySet = new HashSet<>();
            NamingEnumeration namingEnumeration = LdapUtil.getNamingEnumeration(ldapContext, ldap.getAccount(), attributeSet);
            while (namingEnumeration != null && namingEnumeration.hasMoreElements()) {
                //maybe more than one element
                Object obj = namingEnumeration.nextElement();
                if (obj instanceof SearchResult) {
                    SearchResult searchResult = (SearchResult) obj;
                    Attributes attributes = searchResult.getAttributes();
                    NamingEnumeration attributesIDs = attributes.getIDs();
                    while (attributesIDs != null && attributesIDs.hasMoreElements()) {
                        keySet.add(attributesIDs.nextElement().toString());
                    }
                }
            }
            boolean match = true;
            for (String attr : attributeSet) {
                if (attr != null) {
                    if (!keySet.contains(attr)) {
                        match = false;
                    }
                }
            }
            ldapConnectionDTO.setMatchAttribute(match);
        }
        ldapConnectionDTO.setEmailField(ldap.getEmailField());
        ldapConnectionDTO.setLoginNameField(ldap.getLoginNameField());
        ldapConnectionDTO.setPasswordField(ldap.getPasswordField());
        ldapConnectionDTO.setPhoneField(ldap.getPhoneField());
        ldapConnectionDTO.setUserNameField(ldap.getRealNameField());
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
        if (StringUtils.isEmpty(ldap.getLoginNameField())) {
            throw new CommonException("error.ldap.loginNameField.empty");
        }
        if (StringUtils.isEmpty(ldap.getEmailField())) {
            throw new CommonException("error.ldap.emailField.empty");
        }
    }
}
