package io.choerodon.iam.infra.annotation;

import io.choerodon.core.exception.CommonException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.util.Map;

/**
 * @author dengyouquan
 * 根据指定的命名规则解析请求参数，只能用在get方法自定义类上,不能使用在json数据转换中
 **/
public class NamingRuleTransHandler implements HandlerMethodArgumentResolver {

    private static MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(NamingRuleTrans.class);
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer mavContainer, NativeWebRequest nativeWebRequest, WebDataBinderFactory binderFactory) {
        HttpServletRequest servletRequest = nativeWebRequest.getNativeRequest(HttpServletRequest.class);
        String contentType = servletRequest.getContentType();
        if (!"GET".equals(servletRequest.getMethod()) || MediaType.APPLICATION_JSON_VALUE.equals(contentType)) {
            throw new CommonException("error.parse.json.methodArgumentResolver.notSupportJson");
        }
        if (methodParameter.getParameterType().getDeclaredFields().length == 0) {
            throw new CommonException("error.parse.json.methodArgumentResolver.notEntity");
        }
        Object result = null;
        try {
            NamingRuleTrans namingRuleTrans = methodParameter.getParameterAnnotation(NamingRuleTrans.class);
            NamingRuleTransStrategy strategy = namingRuleTrans.value();
            Object obj = BeanUtils.instantiate(methodParameter.getParameterType());
            BeanWrapper wrapper = PropertyAccessorFactory.forBeanPropertyAccess(obj);
            Map<String, String[]> parameterMap = nativeWebRequest.getParameterMap();
            for (Map.Entry<String, String[]> map : parameterMap.entrySet()) {
                String paramName = map.getKey();
                String[] paramValue = map.getValue();
                Field[] declaredFields = obj.getClass().getDeclaredFields();
                for (Field declaredField : declaredFields) {
                    String transParamName = null;
                    switch (strategy) {
                        case UNDER_LINE:
                            transParamName = camelToUnderLine(paramName);
                            break;
                        case CAMEL:
                            transParamName = underLineToCamel(paramName);
                            break;
                        default:
                            transParamName = underLineToCamel(paramName);
                            break;
                    }
                    if (declaredField.getName().equals(transParamName)) {
                        wrapper.setPropertyValue(transParamName, paramValue);
                    }
                }
            }
            result = obj;
        } catch (Exception e) {
            throw new CommonException("error.parse.json.methodArgumentResolver");
        }
        return result;
    }

    private String underLineToCamel(String name) {
        StringBuilder result = new StringBuilder();
        if (name == null || name.isEmpty()) {
            return "";
        } else if (!name.contains("_")) {
            // 不含下划线，仅将首字母小写
            return name.substring(0, 1).toLowerCase() + name.substring(1);
        }
        String camels[] = name.split("_");
        for (String camel : camels) {
            if (camel.isEmpty()) {
                continue;
            }
            if (result.length() == 0) {
                result.append(camel.toLowerCase());
            } else {
                result.append(camel.substring(0, 1).toUpperCase());
                result.append(camel.substring(1).toLowerCase());
            }
        }
        return result.toString();
    }

    private String camelToUnderLine(String name) {
        StringBuilder sb = new StringBuilder(name);
        int temp = 0;
        for (int i = 0; i < name.length(); i++) {
            if (Character.isUpperCase(name.charAt(i))) {
                sb.insert(i + temp, "_");
                temp += 1;
            }
        }
        return sb.toString().toLowerCase();
    }
}
