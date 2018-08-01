package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.Sum
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
    @Autowired
    private DashboardMapper dashboardMapper
    @Autowired
    private TestRestTemplate restTemplate
    def sum = new Sum();
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
        for (int i = 0; i < 5; i++) {
            Dashboard dashboard = new Dashboard();
            dashboard.setCode("project-test-" + i);
            dashboard.setDescription("project-test-desc-" + i);
            dashboard.setName("project-test-name-" + i)
            dashboard.setNamespace("iam")
            dashboard.setIcon("IAM")
            dashboard.setLevel("site")
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
        count == 15
    }

    def "Update"() {
        expect:
        sum.sum(1, 1) == 2
    }

    def "Query"() {
    }

    def "List"() {
        given: "单页查询dashboard list"
        Map<String, Object> parmMap = new HashMap();
        int page = 1;
        int size = 10;
        parmMap.put("page", page)
        parmMap.put("size", size)

        when: "默认查询"

        def entity =
                restTemplate.getForEntity('/v1/dashboards?page={page}&size={size}', Page.class, parmMap)
        then: '状态码为200，查询成功'
        entity.statusCode.is2xxSuccessful() == true
    }
}
