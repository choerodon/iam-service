package io.choerodon.iam.api.controller.v1

import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.ProjectDTO
import io.choerodon.iam.infra.dataobject.ProjectDO
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
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class ProjectControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/projects"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private ProjectMapper projectMapper
    @Shared
    def needInit = true
    @Shared
    def needClean = false
    @Shared
    def projectDOList = new ArrayList<ProjectDO>()
    def organizationId = 1L

    def setup() {
        if (needInit) {
            given: "构造请求参数"
            needInit = false
            for (int i = 0; i < 3; i++) {
                ProjectDO projectDO = new ProjectDO()
                projectDO.setCode("hand" + i)
                projectDO.setName("汉得" + i)
                projectDO.setOrganizationId(1L)
                projectDOList.add(projectDO)
            }

            given: "插入数据"
            def count = projectMapper.insertList(projectDOList)

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
            for (ProjectDO projectDO : projectDOList) {
                count += projectMapper.deleteByPrimaryKey(projectDO)
            }

            then: "校验结果"
            count == 3
        }
    }

    def "Query"() {
        given: "构造请求参数"
        def projectDTO = ConvertHelper.convert(projectDOList.get(0), ProjectDTO)
        def projectId = projectDTO.getId()

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{project_id}", ProjectDTO, projectId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(projectDTO.getId())
        entity.getBody().getCode().equals(projectDTO.getCode())
        entity.getBody().getName().equals(projectDTO.getName())
    }

    def "List"() {
        given: "构造请求参数"
        def projectDTO = ConvertHelper.convert(projectDOList.get(0), ProjectDTO)
        def projectId = projectDTO.getId()
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectId)

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{project_id}/users", Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().totalPages == 1
    }

    def "Update"() {
        given: "构造请求参数"
        def projectDTO = ConvertHelper.convert(projectDOList.get(0), ProjectDTO)
        def projectId = projectDTO.getId()
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectId)

        when: "调用方法"
        projectDTO.setObjectVersionNumber(1)
        def httpEntity = new HttpEntity<Object>(projectDTO)
        def entity = restTemplate.exchange(BASE_PATH + "/{project_id}", HttpMethod.PUT, httpEntity, ProjectDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(projectDTO.getId())
        entity.getBody().getCode().equals(projectDTO.getCode())
        entity.getBody().getName().equals(projectDTO.getName())
    }

    def "DisableProject"() {
        given: "构造请求参数"
        def projectDTO = ConvertHelper.convert(projectDOList.get(0), ProjectDTO)
        def projectId = projectDTO.getId()
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectId)
        def httpEntity = new HttpEntity<Object>()

        when: "调用对应方法"
        def entity = restTemplate.exchange(BASE_PATH + "/{project_id}/disable", HttpMethod.PUT, httpEntity, ProjectDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().getEnabled()
    }
}
