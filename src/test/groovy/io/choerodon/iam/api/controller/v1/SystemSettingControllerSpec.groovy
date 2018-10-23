package io.choerodon.iam.api.controller.v1

import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.SystemSettingDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
/**
 *
 * @author zmf
 *
 */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class SystemSettingControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/system/setting"
    @Autowired
    private TestRestTemplate restTemplate

    private SystemSettingDTO settingDTO

    void setup() {
        settingDTO = new SystemSettingDTO()
        settingDTO.setDefaultLanguage("zh_CN")
        settingDTO.setDefaultPassword("12345678")
        settingDTO.setFavicon("http://minio.staging.saas.hand-china.com/iam-service/file_2913c259dc524231909f5e6083e4c2bf_test.png")
        settingDTO.setSystemName("choerodon")
        settingDTO.setSystemTitle("Choerodon Platform")
        settingDTO.setSystemLogo("http://minio.staging.saas.hand-china.com/iam-service/file_2913c259dc524231909f5e6083e4c2bf_test.png")
    }

    def "AddSetting"() {
        given: "构造请求参数"
        def httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法[成功]"
        def entity = restTemplate.postForEntity(BASE_PATH, httpEntity, SystemSettingDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getObjectVersionNumber() == 1
//        entity.getBody().getCode().equals("error.user.objectVersionNumber.null")
    }

    def "Add setting with invalid system name"() {
        given: "构造请求参数"
        settingDTO.setSystemName(systemName)
        def httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode() == code

        where: "边界请求"
        systemName                 | code
        null                       | "error.setting.name.null"
        "112312412412412412412412" | "error.setting.name.too.long"
    }

    def "add setting with invalid password"() {
        given: "构造请求参数"
        settingDTO.setDefaultPassword(password)
        def httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode() == code

        where: "边界请求"
        password                   | code
        null                       | "error.setting.default.password.null"
        "112312412412412412412412" | "error.setting.default.password.length.invalid"
        "11"                       | "error.setting.default.password.length.invalid"
        "12214441#"                | "error.setting.default.password.format.invalid"
    }

    def "add setting more than once"() {
        given: "构造请求参数"
        def httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法[成功]"
        restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, SystemSettingDTO)
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode() == "error.setting.already.one"
    }

    def "add setting without default language"() {
        given: "构造请求参数"
        settingDTO.setDefaultLanguage(null)
        def httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法[成功]"
        restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, SystemSettingDTO)
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode() == "error.setting.default.language.null"
    }

    def "UpdateSetting"() {
        given: "准备场景"
        restTemplate.delete(BASE_PATH)
        def httpEntity = new HttpEntity<Object>(settingDTO)
        def versionNumber = restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, SystemSettingDTO).getBody().getObjectVersionNumber()
        settingDTO.setSystemName("choerodon-test")
        settingDTO.setObjectVersionNumber(versionNumber)
        httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.PUT, httpEntity, SystemSettingDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getObjectVersionNumber() == versionNumber + 1
    }
    def "UpdateSetting with invalid input"() {
        given: "准备场景"
        restTemplate.delete(BASE_PATH)
        def httpEntity = new HttpEntity<Object>(settingDTO)
        def versionNumber = restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, SystemSettingDTO).getBody().getObjectVersionNumber()
        settingDTO.setSystemName("a")
        settingDTO.setObjectVersionNumber(versionNumber)
        httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.PUT, httpEntity, SystemSettingDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getObjectVersionNumber() == versionNumber + 1
    }

    def "UpdateSetting when the db is empty"() {
        given: "准备场景"
        restTemplate.delete(BASE_PATH)
        def httpEntity = new HttpEntity<Object>(settingDTO)

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.PUT, httpEntity, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode() == "error.setting.update.invalid"
    }

    def "ResetSetting"() {
        when: "调用方法"
        restTemplate.delete(BASE_PATH, SystemSettingDTO)

        then: "校验结果"
        noExceptionThrown()
    }

    def "GetSetting"() {
        given: "当数据库为空时请求"
        restTemplate.delete(BASE_PATH)

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH, SystemSettingDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getObjectVersionNumber() == null


        when: "调用方法"
        def httpEntity = new HttpEntity<Object>(settingDTO)
        entity = restTemplate.exchange(BASE_PATH, HttpMethod.POST, httpEntity, String)
        println(entity.getBody())
        entity = restTemplate.getForEntity(BASE_PATH, SystemSettingDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getObjectVersionNumber() != null
    }

    def "UploadFavicon"() {
        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/system/setting/upload/favicon", null, ExceptionResponse, 0L)

        then: "校验结果"
//        entity.statusCode.is2xxSuccessful()
//        entity.getBody().getCode() == "error.upload.multipartSize"
        noExceptionThrown()
    }

    def "UploadLogo"() {
        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/system/setting/upload/logo", null, ExceptionResponse, 0L)

        then: "校验结果"
//        entity.statusCode.is2xxSuccessful()
//        entity.getBody().getCode() == "error.upload.multipartSize"
        noExceptionThrown()
    }
}
