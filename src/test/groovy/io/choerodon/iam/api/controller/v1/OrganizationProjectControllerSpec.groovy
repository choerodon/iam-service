package io.choerodon.iam.api.controller.v1

import com.github.pagehelper.PageInfo
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dto.ProjectDTO
import io.choerodon.iam.infra.mapper.ProjectMapper
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan* */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class OrganizationProjectControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/organizations/{organization_id}/projects"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private ProjectMapper projectMapper
    @Shared
    def needInit = true
    @Shared
    def needClean = false
    @Shared
    def projectDOList = new ArrayList<ProjectDTO>()
    def organizationId = 1L

    def setup() {
        if (needInit) {
            given: "构造请求参数"
            needInit = false
            for (int i = 0; i < 3; i++) {
                ProjectDTO projectDO = new ProjectDTO()
                projectDO.setCode("hand" + i)
                projectDO.setName("汉得" + i)
                projectDO.setOrganizationId(1L)
                projectDOList.add(projectDO)
            }

            given: "插入数据"
            def count = 0
            for (ProjectDTO dto : projectDOList) {
                projectMapper.insert(dto)
                count++
            }

            then: "校验结果"
            count == 3
        }
    }

    def cleanup() {
        if (needClean) {
            given: "构造请求参数"
            needClean = false
            def count = 0

            given: "插入数据"
            for (ProjectDTO projectDO : projectDOList) {
                count += projectMapper.deleteByPrimaryKey(projectDO)
            }

            then: "校验结果"
            count == 3
        }
    }

    def "Create"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", organizationId)
        def projectDTO = new ProjectDTO()
        projectDTO.setName("测试")
        projectDTO.setCode("test")

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH, projectDTO, ProjectDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getName().equals(projectDTO.getName())
        entity.getBody().getCode().equals(projectDTO.getCode())
        projectMapper.deleteByPrimaryKey(entity.getBody().getId())
    }

    def "List"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", organizationId)

        when: "调用方法[全查询]"
        def entity = restTemplate.getForEntity(BASE_PATH, PageInfo, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().pages != 0
        !entity.getBody().list.isEmpty()

        when: "调用方法[全查询]"
        paramsMap.put("code", "hand")
        paramsMap.put("name", "汉得")
        entity = restTemplate.getForEntity(BASE_PATH + "?code={code}&name={name}", PageInfo, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().pages != 0
        entity.getBody().total != 0
    }

    def "Update"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", organizationId)
        def projectDTO = projectDOList.get(0)

        when: "调用方法[异常-版本号不存在]"
        def projectDTO1 = new ProjectDTO()
        BeanUtils.copyProperties(projectDTO, projectDTO1)
        paramsMap.put("project_id", projectDTO1.getId())
        def httpEntity = new HttpEntity<Object>(projectDTO1)
        def entity = restTemplate.exchange(BASE_PATH + "/{project_id}", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("hand0")

        when: "调用方法[异常-组织不存在]"
        paramsMap.put("organization_id", 1000L)
        projectDTO1.setObjectVersionNumber(1)
        httpEntity = new HttpEntity<Object>(projectDTO1)
        entity = restTemplate.exchange(BASE_PATH + "/{project_id}", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        def projectDTO2 = new ProjectDTO()
        BeanUtils.copyProperties(projectDTO, projectDTO2)
        paramsMap.put("project_id", projectDTO2.getId())
        paramsMap.put("organization_id", organizationId)
        projectDTO2.setObjectVersionNumber(1)
        httpEntity = new HttpEntity<Object>(projectDTO2)
        entity = restTemplate.exchange(BASE_PATH + "/{project_id}", HttpMethod.PUT, httpEntity, ProjectDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getName().equals(projectDTO.getName())
        entity.getBody().getCode().equals(projectDTO.getCode())
    }

    def "EnableProject"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def projectId = projectDOList.get(1).getId()
        def httpEntity = new HttpEntity<Object>()

        when: "调用对应方法[异常-组织id不存在]"
        paramsMap.put("project_id", projectId)
        paramsMap.put("organization_id", 1000L)
        def entity = restTemplate.exchange(BASE_PATH + "/{project_id}/enable", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用对应方法"
        paramsMap.put("project_id", projectId)
        paramsMap.put("organization_id", organizationId)
        entity = restTemplate.exchange(BASE_PATH + "/{project_id}/enable", HttpMethod.PUT, httpEntity, ProjectDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEnabled()
    }

    def "DisableProject"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def projectId = 1L
        def httpEntity = new HttpEntity<Object>()

        when: "调用对应方法[异常-组织id不存在]"
        paramsMap.put("project_id", projectId)
        paramsMap.put("organization_id", 1000L)
        def entity = restTemplate.exchange(BASE_PATH + "/{project_id}/disable", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用对应方法"
        paramsMap.put("project_id", projectId)
        paramsMap.put("organization_id", organizationId)
        entity = restTemplate.exchange(BASE_PATH + "/{project_id}/disable", HttpMethod.PUT, httpEntity, ProjectDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().getEnabled()
    }

    def "Check"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", organizationId)
        def projectDTO = projectDOList.get(1)

        when: "调用对应方法[异常-项目code为空]"
        def projectDTO1 = new ProjectDTO()
        BeanUtils.copyProperties(projectDTO, projectDTO1)
        projectDTO1.setCode(null)
        def entity = restTemplate.postForEntity(BASE_PATH + "/check", projectDTO1, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.project.code.empty")

        when: "调用对应方法[异常-项目存在]"
        def projectDTO2 = new ProjectDTO()
        BeanUtils.copyProperties(projectDTO, projectDTO2)
        projectDTO2.setId(10L)
        entity = restTemplate.postForEntity(BASE_PATH + "/check", projectDTO2, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.project.code.exist")

        when: "调用对应方法"
        def projectDTO3 = new ProjectDTO()
        projectDTO3.setCode("check")
        projectDTO3.setOrganizationId(1L)
        entity = restTemplate.postForEntity(BASE_PATH + "/check", projectDTO3, Void, paramsMap)
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
