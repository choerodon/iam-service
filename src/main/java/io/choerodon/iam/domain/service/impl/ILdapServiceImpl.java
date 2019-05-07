package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.ldap.DirectoryType;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.api.validator.LdapValidator;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.infra.dto.LdapDTO;
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
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.filter.Filter;
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

    private static final String OBJECT_CLASS = "objectclass";

    @Override
    public Map<String, Object> testConnect(LdapDTO ldapDTO) {
        LdapValidator.validate(ldapDTO);
        boolean anonymous = StringUtils.isEmpty(ldapDTO.getAccount()) || StringUtils.isEmpty(ldapDTO.getPassword());
        LdapConnectionDTO ldapConnectionDTO = new LdapConnectionDTO();
        Map<String, Object> returnMap = new HashMap<>(2);

        LdapTemplate ldapTemplate = initLdapTemplate(ldapDTO, anonymous);
        returnMap.put(LDAP_TEMPLATE, ldapTemplate);
        //默认将account当作userDn,如果无法登陆，则去ldap服务器抓取ldapDO.getLoginNameField()==account的userDn，然后使用返回的userDn登陆
        accountAsUserDn(ldapDTO, ldapConnectionDTO, ldapTemplate);
        //输入的账户无法登陆，去ldap服务器抓取userDn(例外hand ldap)
        if (!anonymous && ldapConnectionDTO.getCanConnectServer() && !ldapConnectionDTO.getCanLogin()) {
            returnMap.put(LDAP_TEMPLATE, fetchUserDn2Authenticate(ldapDTO, ldapConnectionDTO));
        }
        returnMap.put(LDAP_CONNECTION_DTO, ldapConnectionDTO);
        return returnMap;
    }

    private LdapTemplate fetchUserDn2Authenticate(LdapDTO ldapDTO, LdapConnectionDTO ldapConnectionDTO) {
        LdapContextSource contextSource = new LdapContextSource();
        String url = ldapDTO.getServerAddress() + ":" + ldapDTO.getPort();
        int connectionTimeout = ldapDTO.getConnectionTimeout();
        contextSource.setUrl(url);
        contextSource.setBase(ldapDTO.getBaseDn());
        contextSource.setAnonymousReadOnly(true);
        setConnectionTimeout(contextSource, connectionTimeout);
        contextSource.afterPropertiesSet();
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        if (DirectoryType.MICROSOFT_ACTIVE_DIRECTORY.value().equals(ldapDTO.getDirectoryType())) {
            ldapTemplate.setIgnorePartialResultException(true);
        }

        String userDn = null;
        Filter filter = getFilterByObjectClassAndAttribute(ldapDTO);
        try {
            List<String> names =
                    ldapTemplate.search(
                            query()
                                    .searchScope(SearchScope.SUBTREE)
                                    .filter(filter),
                            new AbstractContextMapper() {
                                @Override
                                protected Object doMapFromContext(DirContextOperations ctx) {
                                    return ctx.getNameInNamespace();
                                }
                            });
            if (names.size() == 1) {
                userDn = names.get(0);
            }
        } catch (UncategorizedLdapException e) {
            if (e.getRootCause() instanceof NamingException) {
                LOGGER.warn("baseDn or userDn may be wrong!");
            }
            LOGGER.warn("uncategorized ldap exception {}", e);
        } catch (Exception e) {
            LOGGER.warn("can not find anything while filter is {}, exception {}", filter, e);
        }

        if (userDn == null) {
            LOGGER.error("can not find anything or find more than one userDn while filter is {}, login failed", filter);
            return null;
        } else {
            contextSource.setAnonymousReadOnly(false);
            contextSource.setUserDn(userDn);
            contextSource.setPassword(ldapDTO.getPassword());

            ldapConnectionDTO.setCanLogin(false);
            ldapConnectionDTO.setMatchAttribute(false);
            try {
                LdapTemplate newLdapTemplate = new LdapTemplate(contextSource);
                matchAttributes(ldapDTO, ldapConnectionDTO, newLdapTemplate);
                ldapConnectionDTO.setCanLogin(true);
                return newLdapTemplate;
            } catch (InvalidNameException | AuthenticationException e) {
                LOGGER.error("userDn = {} or password is invalid, login failed, exception: {}", userDn, e);
                return null;
            } catch (Exception e) {
                LOGGER.error("unexpected exception: {} ", e);
                return null;
            }
        }
    }

    private Filter getFilterByObjectClassAndAttribute(LdapDTO ldapDTO) {
        String account = ldapDTO.getAccount();
        AndFilter andFilter = getAndFilterByObjectClass(ldapDTO);
        andFilter.and(new EqualsFilter(ldapDTO.getLoginNameField(), account));
        return andFilter;
    }

    private AndFilter getAndFilterByObjectClass(LdapDTO ldapDO) {
        String objectClass = ldapDO.getObjectClass();
        String[] arr = objectClass.split(",");
        AndFilter andFilter = new AndFilter();
        for (String str : arr) {
            andFilter.and(new EqualsFilter(OBJECT_CLASS, str));
        }
        return andFilter;
    }

    private void accountAsUserDn(LdapDTO ldapDTO, LdapConnectionDTO ldapConnectionDTO, LdapTemplate ldapTemplate) {
        try {
            if (DirectoryType.MICROSOFT_ACTIVE_DIRECTORY.value().equals(ldapDTO.getDirectoryType())) {
                ldapTemplate.setIgnorePartialResultException(true);
            }
            ldapConnectionDTO.setCanConnectServer(false);
            ldapConnectionDTO.setCanLogin(false);
            ldapConnectionDTO.setMatchAttribute(false);
            //使用管理员登陆，查询一个objectclass=ldapDO.getObjectClass的对象去匹配属性
            matchAttributes(ldapDTO, ldapConnectionDTO, ldapTemplate);
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

    private LdapTemplate initLdapTemplate(LdapDTO ldapDTO, boolean anonymous) {
        LdapContextSource contextSource = new LdapContextSource();
        String url = ldapDTO.getServerAddress() + ":" + ldapDTO.getPort();
        int connectionTimeout = ldapDTO.getConnectionTimeout();
        contextSource.setUrl(url);
        contextSource.setBase(ldapDTO.getBaseDn());
        setConnectionTimeout(contextSource, connectionTimeout);

        if (!anonymous) {
            contextSource.setUserDn(ldapDTO.getAccount());
            contextSource.setPassword(ldapDTO.getPassword());
        } else {
            contextSource.setAnonymousReadOnly(true);
        }
        contextSource.afterPropertiesSet();
        return new LdapTemplate(contextSource);
    }

    private void setConnectionTimeout(LdapContextSource contextSource, int connectionTimeout) {
        Map<String, Object> environment = new HashMap<>(1);
        //设置ldap服务器连接超时时间为10s
        environment.put("com.sun.jndi.ldap.connect.timeout", String.valueOf(connectionTimeout * 1000));
        contextSource.setBaseEnvironmentProperties(environment);
    }

    private void matchAttributes(LdapDTO ldapDTO, LdapConnectionDTO ldapConnectionDTO, LdapTemplate ldapTemplate) {
        Map<String, String> attributeMap = initAttributeMap(ldapDTO);
        Filter filter = getAndFilterByObjectClass(ldapDTO);
        List<Attributes> attributesList =
                ldapTemplate.search(
                        query()
                                .searchScope(SearchScope.SUBTREE)
                                .countLimit(100).filter(filter),
                        new AttributesMapper<Attributes>() {
                            @Override
                            public Attributes mapFromAttributes(Attributes attributes) throws NamingException {
                                return attributes;
                            }
                        });
        if (attributesList.isEmpty()) {
            LOGGER.warn("can not get any attributes while the filter is {}", filter);
            ldapConnectionDTO.setLoginNameField(ldapDTO.getLoginNameField());
            ldapConnectionDTO.setRealNameField(ldapDTO.getRealNameField());
            ldapConnectionDTO.setPhoneField(ldapDTO.getPhoneField());
            ldapConnectionDTO.setEmailField(ldapDTO.getEmailField());
        } else {
            Set<String> keySet = new HashSet<>();
            for (Attributes attributes : attributesList) {
                NamingEnumeration<String> attributesIDs = attributes.getIDs();
                while (attributesIDs != null && attributesIDs.hasMoreElements()) {
                    keySet.add(attributesIDs.nextElement());
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

    private Map<String, String> initAttributeMap(LdapDTO ldap) {
        Map<String, String> attributeMap = new HashMap<>(10);
        attributeMap.put(LdapDTO.GET_LOGIN_NAME_FIELD, ldap.getLoginNameField());
        attributeMap.put(LdapDTO.GET_REAL_NAME_FIELD, ldap.getRealNameField());
        attributeMap.put(LdapDTO.GET_EMAIL_FIELD, ldap.getEmailField());
        attributeMap.put(LdapDTO.GET_PHONE_FIELD, ldap.getPhoneField());
        attributeMap.put(LdapDTO.GET_UUID_FIELD, ldap.getUuidField());
        return attributeMap;
    }

}
