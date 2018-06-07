package io.choerodon.iam.domain.service.impl;

import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.validator.LdapValidator;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.infra.common.utils.ldap.LdapUtil;
import io.choerodon.iam.infra.dataobject.LdapDO;
import org.springframework.stereotype.Service;

import javax.naming.NamingEnumeration;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;
import java.util.*;

/**
 * @author superlee
 */
@Service
public class ILdapServiceImpl implements ILdapService {

    @Override
    public LdapConnectionDTO testConnect(LdapDO ldap) {
        LdapValidator.validate(ldap);
        //匿名用户
        boolean anonymous = ldap.getAccount() == null || ldap.getPassword() == null;
        LdapConnectionDTO ldapConnectionDTO = new LdapConnectionDTO();
        //测试连接
        LdapContext ldapContext = LdapUtil.ldapConnect(ldap.getServerAddress(), ldap.getBaseDn(), ldap.getPort(), ldap.getUseSSL());
        if (ldapContext != null) {
            //可以连接服务器测试登陆
            ldapConnectionDTO.setCanConnectServer(true);
            if (anonymous) {
                //匿名用户，直接为可登录
                ldapConnectionDTO.setCanLogin(true);
                //匿名属性匹配，只能匹配loginNameField和emailField
                anonymousUserMatchAttributeTesting(ldapContext, ldapConnectionDTO, ldap);
            } else {
                //非匿名用户，登陆测试
                LdapContext context = loginTesting(ldap);
                ldapConnectionDTO.setCanLogin(context != null);
                if (ldapConnectionDTO.getCanLogin()) {
                    //可以登陆，匹配属性
                    matchAttributeTesting(context, ldapConnectionDTO, ldap);
                } else {
                    ldapConnectionDTO.setMatchAttribute(false);
                }
            }
        } else {
            //连不上ldap服务器，全失败
            ldapConnectionDTO.setCanConnectServer(false);
            ldapConnectionDTO.setCanLogin(false);
            ldapConnectionDTO.setMatchAttribute(false);
        }
        return ldapConnectionDTO;
    }

    @Override
    public void matchAttributeTesting(LdapContext ldapContext, LdapConnectionDTO ldapConnectionDTO,
                                       LdapDO ldap) {
            //todo 这个地方写的不好，写死了
            Map<String, String> attributeMap = initAttributeMap(ldap);
            Set<String> attributeSet = new HashSet<>(attributeMap.values());
            //default attribute 处理
            attributeSet.addAll(new HashSet<>(Arrays.asList("employeeNumber", "mail", "mobile")));
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

    /**
     * 匿名匹配字段只能匹配loginNameField和emailField
     * @param ldapContext
     * @param ldapConnectionDTO
     * @param ldap
     */
    @Override
    public void anonymousUserMatchAttributeTesting(LdapContext ldapContext, LdapConnectionDTO ldapConnectionDTO,
                                                    LdapDO ldap) {
        Attributes attributes = LdapUtil.anonymousUserGetByObjectClass(ldap,ldapContext);
        //todo 这个地方写的不好，写死了
        Map<String, String> attributeMap = new HashMap<>(10);
        attributeMap.put(LdapDTO.GET_LOGIN_NAME_FIELD, ldap.getLoginNameField());
        attributeMap.put(LdapDTO.GET_EMAIL_FIELD, ldap.getEmailField());
        Set<String> keySet = new HashSet<>();
        if (attributes != null) {
            NamingEnumeration attributesIDs = attributes.getIDs();
            while (attributesIDs != null && attributesIDs.hasMoreElements()) {
                keySet.add(attributesIDs.nextElement().toString());
            }
            fullMathAttribute(ldapConnectionDTO, attributeMap, keySet);
        } else {
            ldapConnectionDTO.setMatchAttribute(false);
            ldapConnectionDTO.setLoginNameField(ldap.getLoginNameField());
            ldapConnectionDTO.setRealNameField(ldap.getRealNameField());
            ldapConnectionDTO.setPhoneField(ldap.getPhoneField());
            ldapConnectionDTO.setEmailField(ldap.getEmailField());
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
        attributeMap.put(LdapDTO.GET_PHONE_FIELD, ldap.getPhoneField());
        return attributeMap;
    }

    private LdapContext loginTesting(LdapDO ldap) {
        return LdapUtil.authenticate(ldap.getAccount(), ldap.getPassword(), ldap);
    }

}
