package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.ldap.DirectoryType;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.validator.LdapValidator;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.infra.dataobject.LdapDO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ldap.AuthenticationException;
import org.springframework.ldap.CommunicationException;
import org.springframework.ldap.InvalidNameException;
import org.springframework.ldap.UncategorizedLdapException;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.AbstractContextMapper;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.query.SearchScope;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.util.*;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

/**
 * @author superlee
 */
@Service
public class ILdapServiceImpl implements ILdapService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ILdapServiceImpl.class);

    public static final String LDAP_CONNECTION_DTO = "ldapConnectionDTO";

    public static final String LDAP_TEMPLATE = "ldapTemplate";

    @Override
    public Map<String, Object> testConnect(LdapDO ldapDO) {
        LdapValidator.validate(ldapDO);
        boolean anonymous = StringUtils.isEmpty(ldapDO.getAccount()) || StringUtils.isEmpty(ldapDO.getPassword());
        LdapConnectionDTO ldapConnectionDTO = new LdapConnectionDTO();
        Map<String, Object> returnMap = new HashMap<>(2);

        LdapTemplate ldapTemplate = initLdapTemplate(ldapDO, anonymous);
        returnMap.put(LDAP_TEMPLATE, ldapTemplate);
        //默认将account当作userDn,如果无法登陆，则去ldap服务器抓取ldapDO.getLoginNameField()==account的userDn，然后使用返回的userDn登陆
        accountAsUserDn(ldapDO, anonymous, ldapConnectionDTO, ldapTemplate);
        //去ldap服务器抓取userDn
        if (!anonymous && ldapConnectionDTO.getCanConnectServer() && !ldapConnectionDTO.getCanLogin()) {
            returnMap.put(LDAP_TEMPLATE, fetchUserDn2Authenticate(ldapDO, ldapConnectionDTO));
        }
        returnMap.put(LDAP_CONNECTION_DTO, ldapConnectionDTO);
        return returnMap;
    }

    private LdapTemplate fetchUserDn2Authenticate(LdapDO ldapDO, LdapConnectionDTO ldapConnectionDTO) {
        LdapContextSource contextSource = new LdapContextSource();
        String url = ldapDO.getServerAddress() + ":" + ldapDO.getPort();
        contextSource.setUrl(url);
        contextSource.setBase(ldapDO.getBaseDn());
        contextSource.setAnonymousReadOnly(true);
        contextSource.afterPropertiesSet();
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        if (DirectoryType.MICROSOFT_ACTIVE_DIRECTORY.value().equals(ldapDO.getDirectoryType())) {
            ldapTemplate.setIgnorePartialResultException(true);
        }

        Map<String, String> attributeMap = initAttributeMap(ldapDO);
        Set<String> attributeSet = initAttributeSet(attributeMap);
        String userDn = null;

        for (String attr : attributeSet) {
            try {
                List<String> names =
                        ldapTemplate.search(
                                query()
                                        .searchScope(SearchScope.SUBTREE)
                                        .where("objectclass")
                                        .is(ldapDO.getObjectClass())
                                        .and(attr)
                                        .is(ldapDO.getAccount()),
                                new AbstractContextMapper() {
                                    @Override
                                    protected Object doMapFromContext(DirContextOperations ctx) {
                                        return ctx.getNameInNamespace();
                                    }
                                });
                if (!names.isEmpty()) {
                    userDn = names.get(0);
                    break;
                }
            } catch (UncategorizedLdapException e) {
                if (e.getRootCause() instanceof NamingException) {
                    LOGGER.warn("baseDn or userDn may be wrong!");
                }
                LOGGER.warn("uncategorized ldap exception {}", e);
            } catch (Exception e) {
                LOGGER.warn("can not find attributes where objectclass = {} and {} = {} , exception {}", ldapDO.getObjectClass(), attr, ldapDO.getAccount(), e);
            }
        }

        if (userDn == null) {
            LOGGER.error("can not find attributes where objectclass = {} and {} = {}, login failed", ldapDO.getObjectClass(), ldapDO.getLoginNameField(), ldapDO.getAccount());
            return null;
        } else {
            contextSource.setAnonymousReadOnly(false);
            contextSource.setUserDn(userDn);
            contextSource.setPassword(ldapDO.getPassword());

            ldapConnectionDTO.setCanLogin(false);
            ldapConnectionDTO.setMatchAttribute(false);
            try {
                LdapTemplate newLdapTemplate = new LdapTemplate(contextSource);
                matchAttributes(ldapDO, ldapConnectionDTO, newLdapTemplate);
                ldapConnectionDTO.setCanLogin(true);
                return newLdapTemplate;
            } catch (InvalidNameException e) {
                LOGGER.error("userDn = {} or password is invalid, login failed, exception: {}", userDn, e);
                return null;
            } catch (AuthenticationException e) {
                LOGGER.error("userDn = {} or password is invalid, login failed, exception: {}", userDn, e);
                return null;
            } catch (Exception e) {
                LOGGER.error("unexpected exception: {} ", e);
                return null;
            }
        }
    }

    private void accountAsUserDn(LdapDO ldapDO, boolean anonymous, LdapConnectionDTO ldapConnectionDTO, LdapTemplate ldapTemplate) {
        try {
            if (DirectoryType.MICROSOFT_ACTIVE_DIRECTORY.value().equals(ldapDO.getDirectoryType())) {
                ldapTemplate.setIgnorePartialResultException(true);
            }
            ldapConnectionDTO.setCanConnectServer(false);
            ldapConnectionDTO.setCanLogin(false);
            ldapConnectionDTO.setMatchAttribute(false);
            if (anonymous) {
                anonymousUserMatchAttributes(ldapDO, ldapConnectionDTO, ldapTemplate);
            } else {
                matchAttributes(ldapDO, ldapConnectionDTO, ldapTemplate);
            }
            ldapConnectionDTO.setCanConnectServer(true);
            ldapConnectionDTO.setCanLogin(true);
        } catch (InvalidNameException | AuthenticationException e) {
            if (e.getRootCause() instanceof javax.naming.InvalidNameException
                    || e.getRootCause() instanceof javax.naming.AuthenticationException) {
                ldapConnectionDTO.setCanConnectServer(true);
                ldapConnectionDTO.setCanLogin(false);
            }
            LOGGER.warn("can not login when using account as userDn, so fetch userDn from ldap server, exception {}", e);
        } catch (UncategorizedLdapException | CommunicationException e) {
            if (e.getRootCause() instanceof MalformedURLException
                    || e.getRootCause() instanceof UnknownHostException) {
                //ldap连接失败
                ldapConnectionDTO.setCanConnectServer(false);
                ldapConnectionDTO.setCanLogin(false);
            }
            LOGGER.error("connect to ldap server failed, exception: {}", e);
        } catch (Exception e) {
            ldapConnectionDTO.setCanConnectServer(false);
            ldapConnectionDTO.setCanLogin(false);
            LOGGER.error("connect to ldap server failed, exception: {}", e);
        }
    }

    private LdapTemplate initLdapTemplate(LdapDO ldapDO, boolean anonymous) {
        LdapContextSource contextSource = new LdapContextSource();
        String url = ldapDO.getServerAddress() + ":" + ldapDO.getPort();
        contextSource.setUrl(url);
        contextSource.setBase(ldapDO.getBaseDn());
        if (!anonymous) {
            contextSource.setUserDn(ldapDO.getAccount());
            contextSource.setPassword(ldapDO.getPassword());
        } else {
            contextSource.setAnonymousReadOnly(true);
        }
        contextSource.afterPropertiesSet();
        return new LdapTemplate(contextSource);
    }

    private void matchAttributes(LdapDO ldapDO, LdapConnectionDTO ldapConnectionDTO, LdapTemplate ldapTemplate) {
        Map<String, String> attributeMap = initAttributeMap(ldapDO);
        Set<String> attributeSet = initAttributeSet(attributeMap);
        NamingEnumeration attributesIDs = null;
        for (String attr : attributeSet) {
            List<Attributes> attributes =
                    ldapTemplate.search(
                            query()
                                    .searchScope(SearchScope.SUBTREE)
                                    .where(attr)
                                    .is(ldapDO.getAccount()),
                            new AttributesMapper() {
                                @Override
                                public Object mapFromAttributes(Attributes attributes) throws NamingException {
                                    return attributes;
                                }
                            });
            if (!attributes.isEmpty()) {
                attributesIDs = attributes.get(0).getIDs();
                break;
            }
        }
        if (attributesIDs == null) {
            LOGGER.warn("can not search any attributes while attributes fields {} equals {}, maybe the baseDn is wrong or loginFiled is wrong", attributeSet, ldapDO.getAccount());
            ldapConnectionDTO.setCanLogin(false);
            ldapConnectionDTO.setLoginNameField(ldapDO.getLoginNameField());
            ldapConnectionDTO.setRealNameField(ldapDO.getRealNameField());
            ldapConnectionDTO.setPhoneField(ldapDO.getPhoneField());
            ldapConnectionDTO.setEmailField(ldapDO.getEmailField());
        } else {
            Set<String> keySet = new HashSet<>();
            while (attributesIDs.hasMoreElements()) {
                keySet.add(attributesIDs.nextElement().toString());
            }
            fullMathAttribute(ldapConnectionDTO, attributeMap, keySet);
        }
    }

    private Set<String> initAttributeSet(Map<String, String> attributeMap) {
        Set<String> attributeSet = new HashSet<>(attributeMap.values());
        //default attribute 处理
        attributeSet.addAll(new HashSet<>(Arrays.asList("employeeNumber", "mail", "mobile")));
        attributeSet.remove(null);
        attributeSet.remove("");
        return attributeSet;
    }

    private void anonymousUserMatchAttributes(LdapDO ldapDO, LdapConnectionDTO ldapConnectionDTO, LdapTemplate ldapTemplate) {
        List<Attributes> attributes =
                ldapTemplate.search(
                        query()
                                .searchScope(SearchScope.SUBTREE)
                                .countLimit(1)
                                .where("objectclass")
                                .is(ldapDO.getObjectClass()),
                        new AttributesMapper() {
                            @Override
                            public Object mapFromAttributes(Attributes attributes) throws NamingException {
                                return attributes;
                            }
                        });
        if (attributes.isEmpty()) {
            LOGGER.warn("can not get any attributes where objectclass = {}", ldapDO.getObjectClass());
            ldapConnectionDTO.setLoginNameField(ldapDO.getLoginNameField());
            ldapConnectionDTO.setRealNameField(ldapDO.getRealNameField());
            ldapConnectionDTO.setPhoneField(ldapDO.getPhoneField());
            ldapConnectionDTO.setEmailField(ldapDO.getEmailField());
        } else {
            Map<String, String> attributeMap = new HashMap<>(5);
            attributeMap.put(LdapDTO.GET_LOGIN_NAME_FIELD, ldapDO.getLoginNameField());
            attributeMap.put(LdapDTO.GET_EMAIL_FIELD, ldapDO.getEmailField());
            Set<String> keySet = new HashSet<>();
            NamingEnumeration attributesIDs = attributes.get(0).getIDs();
            while (attributesIDs != null && attributesIDs.hasMoreElements()) {
                keySet.add(attributesIDs.nextElement().toString());
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
        attributeMap.put(LdapDTO.GET_PHONE_FIELD, ldap.getPhoneField());
        return attributeMap;
    }

}
