package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.DashboardDTO
import io.choerodon.iam.domain.iam.entity.Dashboard
import io.choerodon.iam.infra.mapper.DashboardMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import spock.lang.Shared
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
/**
 * @author dongfan117@gmail.com
 */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class DashboardControllerSpec extends Specification {
    private static String path = "/v1/dashboards"

    @Autowired
    private DashboardMapper dashboardMapper
    @Autowired
    private TestRestTemplate restTemplate
    @Shared
    List<Dashboard> dashboardList = new ArrayList<>()

    void setup() {
        given: '初始化dashboard'

        for (int i = 0; i < 3; i++) {
            Dashboard dashboard = new Dashboard();
            dashboard.setCode("site-test-" + i);
            dashboard.setDescription("site-test-desc-" + i);
            dashboard.setName("site-test-name-" + i)
            dashboard.setNamespace("iam")
            dashboard.setIcon("IAM")
            dashboard.setLevel("site")
            dashboard.setSort(i + 1)
            dashboard.setTitle("site-test-title-" + i)
            dashboardList.add(dashboard)
        }
        for (int i = 0; i < 4; i++) {
            Dashboard dashboard = new Dashboard();
            dashboard.setCode("project-test-" + i);
            dashboard.setDescription("project-test-desc-" + i);
            dashboard.setName("project-test-name-" + i)
            dashboard.setNamespace("iam")
            dashboard.setIcon("IAM")
            dashboard.setLevel("project")
            dashboard.setSort(i + 1)
            dashboard.setTitle("project-test-title-" + i)
            dashboardList.add(dashboard)
        }
        for (int i = 0; i < 5; i++) {
            Dashboard dashboard = new Dashboard();
            dashboard.setCode("org-test-" + i);
            dashboard.setDescription("org-test-desc-" + i);
            dashboard.setName("org-test-name-" + i)
            dashboard.setNamespace("iam")
            dashboard.setIcon("IAM")
            dashboard.setLevel("organization")
            dashboard.setSort(i + 1)
            dashboard.setTitle("org-test-title-" + i)
            dashboardList.add(dashboard)
        }

        when: '批量插入dashboard'
        def count = 0;
        for (Dashboard dashboard : dashboardList) {
            count = count + dashboardMapper.insert(dashboard)
        }

        then: '批量插入成功'
        count == 12
    }


    def "List"() {
        given: "单页查询dashboard list"
        Map<String, Object> parmMap = new HashMap();
        parmMap.put("page", 0)
        parmMap.put("size", 10)

        when: "默认查询"

        def entity =
                restTemplate.getForEntity(path + '?page={page}&size={size}', Page.class, parmMap)
        then: '默认查询成功'
        entity.statusCode.is2xxSuccessful() == true
        entity.body.getTotalPages() == 2
        entity.body.getTotalElements() == 12
        entity.getBody().size() == 10

        when: "根据level 查询"
        parmMap.put("level", "project")
        entity =
                restTemplate.getForEntity(path + '?page={page}&size={size}&level={level}', Page.class, parmMap)
        then: '根据level 查询成功'
        entity.statusCode.is2xxSuccessful() == true
        entity.body.getTotalPages() == 1
        entity.body.getTotalElements() == 4
        entity.getBody().size() == 4

        when: "根据name 查询"
        parmMap.put("name", "org-test-name")
        entity =
                restTemplate.getForEntity(path + '?page={page}&size={size}&name={name}', Page.class, parmMap)
        then: '根据name 查询成功'
        entity.statusCode.is2xxSuccessful() == true
        entity.body.getTotalPages() == 1
        entity.body.getTotalElements() == 5
        entity.getBody().size() == 5

        when: "根据code 查询"
        parmMap.put("code", "test")
        entity =
                restTemplate.getForEntity(path + '?page={page}&size={size}&code={code}', Page.class, parmMap)
        then: '根据code 查询成功'
        entity.statusCode.is2xxSuccessful() == true
        entity.body.getTotalPages() == 2
        entity.body.getTotalElements() == 12
        entity.getBody().size() == 10

        when: "根据所有条件查询"
        Map<String, Object> allParmMap = new HashMap();
        allParmMap.put("page", 0)
        allParmMap.put("size", 5)
        allParmMap.put("code", "test")
        allParmMap.put("level", "project")
        allParmMap.put("name", "name-2")
        entity =
                restTemplate.getForEntity(path + '?page={page}&size={size}&level={level}&name={name}&code={code}', Page.class, allParmMap)
        then: '根据所有条件查询成功'
        entity.statusCode.is2xxSuccessful() == true
        entity.body.getTotalPages() == 1
        entity.body.getTotalElements() == 1
        entity.getBody().size() == 1
    }

    def "Query"() {
        given: "根据Id 获取Dashboard"

        Dashboard dashboard = dashboardList.get(10)
        when:
        "查询Dashboard Id=" + dashboard.getId() + "的dashboard"

        def entity =
                restTemplate.getForEntity(path + '/' + dashboard.getId(), DashboardDTO.class)

        then: '查询成功'
        entity.statusCode.is2xxSuccessful() == true
        DashboardDTO dashboardDTO = entity.getBody()

        dashboardDTO.getId() == dashboard.getId()
        dashboardDTO.getCode().equals(dashboard.getCode())
        dashboardDTO.getDescription().equals(dashboard.getDescription())
        dashboardDTO.getIcon().equals(dashboard.getIcon())
        dashboardDTO.getLevel().equals(dashboard.getLevel())
        dashboardDTO.getName().equals(dashboard.getName())
        dashboardDTO.getNamespace().equals(dashboard.getNamespace())
        dashboardDTO.getSort().equals(dashboard.getSort())
        dashboardDTO.getTitle().equals(dashboard.getTitle())

        when:
        "查询Dashboard Id=" + 15 + "的dashboard"
        entity =
                restTemplate.getForEntity(path + '/' + 15, ExceptionResponse.class)

        then: '查询失败'
        entity.statusCode.is2xxSuccessful() == true
        entity.getBody().getCode().equals("error.dashboard.not.exist")
        entity.getBody().getMessage().equals("该Dashboard不存在")
    }

    def "Update"() {
        given: "根据Id 更新dashboard"

        Dashboard dashboard = dashboardList.get(5)
        and:
        "查询Dashboard Id=" + dashboard.getId() + "的dashboard"

        def entity =
                restTemplate.getForEntity(path + '/' + dashboard.getId(), DashboardDTO.class)

        entity.statusCode.is2xxSuccessful() == true
        DashboardDTO dashboardDTO = entity.getBody()

        when: "更新Dashboard"
        dashboardDTO.setName(dashboard.getName() + "-up")
        dashboardDTO.setTitle(dashboard.getTitle() + "-up")
        dashboardDTO.setDescription(dashboard.getDescription() + "-up")
        dashboardDTO.setIcon(dashboard.getIcon() + "-up")

        entity =
                restTemplate.postForEntity(path + '/' + dashboardDTO.getId(), dashboardDTO, DashboardDTO.class)

        then: '更新成功'

        entity.statusCode.is2xxSuccessful() == true
        entity.getBody().getId() == dashboardDTO.getId()
        entity.getBody().getCode().equals(dashboardDTO.getCode())
        entity.getBody().getDescription().equals(dashboardDTO.getDescription())
        entity.getBody().getIcon().equals(dashboardDTO.getIcon())
        entity.getBody().getLevel().equals(dashboardDTO.getLevel())
        entity.getBody().getName().equals(dashboardDTO.getName())
        entity.getBody().getNamespace().equals(dashboardDTO.getNamespace())
        entity.getBody().getSort().equals(dashboardDTO.getSort())
        entity.getBody().getTitle().equals(dashboardDTO.getTitle())
        entity.getBody().getObjectVersionNumber() == 2
    }

}
