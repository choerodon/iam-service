package io.choerodon.iam.api.controller.v1

import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.UserDashboardDTO
import io.choerodon.iam.domain.iam.entity.DashboardE
import io.choerodon.iam.infra.mapper.DashboardMapper
import io.choerodon.iam.infra.mapper.UserDashboardMapper
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
class UserDashboardControllerSpec extends Specification {

    private static String path = "/v1/home/dashboard"
    @Shared
    boolean sharedSetupDone = false;
    @Shared
    boolean sharedCleanupDone = true;

    @Autowired
    private UserDashboardMapper userDashboardMapper
    @Autowired
    private DashboardMapper dashboardMapper
    @Autowired
    private TestRestTemplate restTemplate
    @Shared
    List<DashboardE> dashboardList = new ArrayList<>()

    void setup() {
        if (!sharedSetupDone) {
            given: '初始化dashboard'

            for (int i = 0; i < 3; i++) {
                DashboardE dashboard = new DashboardE();
                dashboard.setId(1000 + i);
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
                DashboardE dashboard = new DashboardE();
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
                DashboardE dashboard = new DashboardE();
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
            for (DashboardE dashboard : dashboardList) {
                count = count + dashboardMapper.insert(dashboard)
            }
            sharedSetupDone = true

            then: '批量插入成功'
            count == 12

        }
    }

    def cleanup() {
        if (!sharedCleanupDone) {
            when: '批量删除dashboard'
            def count = 0;
            for (DashboardE dashboard : dashboardList) {
                count = count + dashboardMapper.deleteByPrimaryKey(dashboard)
            }

            then: '批量删除成功'
            count == 12
        }
    }


    def "List"() {

        given: "单页查询dashboard list"
        Map<String, Object> paramMap = new HashMap();
        paramMap.put("level", "site")
        paramMap.put("sourceId", 0)

        when: "查询site层"
        def entity =
                restTemplate.getForEntity(path + '?level={level}&source_id={sourceId}', String, paramMap)
        sharedCleanupDone = false

        then: '查询site成功'
        entity.statusCode.is2xxSuccessful()

        when: "查询project层"
        paramMap.put("level", "project")
        entity =
                restTemplate.getForEntity(path + '?level={level}&source_id={sourceId}', String, paramMap)

        then: '查询site成功'
        entity.statusCode.is2xxSuccessful()
    }

    def "Update"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("level", "project")
        paramsMap.put("source_id", 1)
        def userDashboard1 = dashboardList.get(1)
        def userDashboard2 = dashboardList.get(2)
        def userDashboardDTO1 = new UserDashboardDTO()
        userDashboardDTO1.setObjectVersionNumber(2)
        userDashboardDTO1.setDashboardId(userDashboard1.getId())
        userDashboardDTO1.setLevel(userDashboard1.getLevel())
        userDashboardDTO1.setDashboardCode(userDashboard1.getCode())
        userDashboardDTO1.setSort(userDashboard1.getSort())
        userDashboardDTO1.setDashboardDescription(userDashboard1.getDescription())
        userDashboardDTO1.setDashboardIcon(userDashboard1.getIcon())
        userDashboardDTO1.setDashboardTitle(userDashboard1.getTitle())
        userDashboardDTO1.setNeedRoles(userDashboardDTO1.getNeedRoles())
        userDashboardDTO1.setDashboardName("update-1")
        def userDashboardDTO2 = new UserDashboardDTO()
        userDashboardDTO2.setObjectVersionNumber(2)
        userDashboardDTO2.setDashboardId(userDashboard2.getId())
        userDashboardDTO2.setLevel(userDashboard2.getLevel())
        userDashboardDTO2.setSort(userDashboard2.getSort())
        userDashboardDTO2.setDashboardCode(userDashboard2.getCode())
        userDashboardDTO2.setDashboardDescription(userDashboard2.getDescription())
        userDashboardDTO2.setDashboardIcon(userDashboard2.getIcon())
        userDashboardDTO2.setDashboardTitle(userDashboard2.getTitle())
        userDashboardDTO2.setNeedRoles(userDashboard2.getNeedRoles())
        userDashboardDTO2.setDashboardName("update-2")
        def userDashboardDTOs = new ArrayList<UserDashboardDTO>()
        userDashboardDTOs.add(userDashboardDTO1)
        userDashboardDTOs.add(userDashboardDTO2)

        when: "调用方法"
        paramsMap.put("level", "error")
        def entity = restTemplate.postForEntity(path + "?level={level}&source_id={source_id}", userDashboardDTOs, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.level.illegal")

        when: "调用方法"
        paramsMap.put("level", "site")
        entity = restTemplate.postForEntity(path + "?level={level}&source_id={source_id}", userDashboardDTOs, String, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 2
    }
}
