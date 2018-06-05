package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.infra.common.utils.ldap.LdapUtil;
import io.choerodon.iam.infra.dataobject.LdapDO;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.naming.NamingEnumeration;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
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
        ldapConnectionDTO.setCanConnectServer(connectServerTesting(ldap));
        LdapContext ldapContext = loginTesting(ldap);
        ldapConnectionDTO.setCanLogin(ldapContext != null);
        matchAttributeTesting(ldapContext, ldapConnectionDTO, ldap);
        return ldapConnectionDTO;
    }

    private void matchAttributeTesting(LdapContext ldapContext, LdapConnectionDTO ldapConnectionDTO,
                                       LdapDO ldap) {
        if (ldapContext == null) {
            //登陆不成功，匹配属性测试也是失败的
            ldapConnectionDTO.setMatchAttribute(false);
        } else {
            //todo 这个地方写的不好，写死了
            Map<String, String> attributeMap = initAttributeMap(ldap);
            Set<String> attributeSet = new HashSet<>(attributeMap.values());
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
            fullMathAttribute(ldapConnectionDTO, attributeMap, keySet);
        }
    }

    private void fullMathAttribute(LdapConnectionDTO ldapConnectionDTO, Map<String, String> attributeMap, Set<String> keySet) {
        boolean match = true;
        for (Map.Entry<String, String> entry : attributeMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value != null && !keySet.contains(value)) {
                match = false;
                ldapConnectionDTO.fullFields(key, value);
            }
        }
        ldapConnectionDTO.setMatchAttribute(match);
    }

    private Map<String, String> initAttributeMap(LdapDO ldap) {
        Map<String, String> attributeMap = new HashMap<>(10);
        attributeMap.put(LdapDTO.GET_LOGIN_NAME_FIELD, ldap.getLoginNameField());
        attributeMap.put(LdapDTO.GET_REAL_NAME_FIELD, ldap.getRealNameField());
        attributeMap.put(LdapDTO.GET_EMAIL_FIELD, ldap.getEmailField());
        attributeMap.put(LdapDTO.GET_PASSWORD_FIELD, ldap.getPasswordField());
        attributeMap.put(LdapDTO.GET_PHONE_FIELD, ldap.getPhoneField());
        return attributeMap;
    }

    private LdapContext loginTesting(LdapDO ldap) {
        return LdapUtil.authenticate(ldap.getAccount(), ldap.getPassword(), ldap);
    }

    private boolean connectServerTesting(LdapDO ldap) {
        return LdapUtil.ldapConnect(ldap.getServerAddress(), ldap.getBaseDn(), ldap.getPort(), ldap.getUseSSL()) != null;
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
