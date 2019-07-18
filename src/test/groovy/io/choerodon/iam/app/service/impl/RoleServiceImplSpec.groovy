package io.choerodon.iam.app.service.impl

import com.github.pagehelper.PageInfo
import io.choerodon.base.domain.PageRequest
import io.choerodon.core.domain.Page
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.RoleSearchDTO
import io.choerodon.iam.api.query.RoleQuery
import io.choerodon.iam.app.service.RoleService
import io.choerodon.iam.infra.dto.RoleDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class RoleServiceImplSpec extends Specification {
    @Autowired
    private RoleService roleService

    def "PagingQuery"() {
        given: "构造请求参数"
        Boolean needUsers = true
        Long sourceId = 0L
        String sourceType = "site"
        RoleSearchDTO role = new RoleSearchDTO()

        when: "调用方法[site层]"
        RoleQuery roleQuery = new RoleQuery()
        roleQuery.setSourceId(sourceId)
        roleQuery.setWithUser(needUsers)
        roleQuery.setSourceType(sourceType)
        PageRequest pageRequest = new PageRequest(1,20)

        PageInfo<RoleDTO> page = roleService.pagingSearch(pageRequest, roleQuery)

        then: "校验参数"
        page.pages != 0
        page.total != 0

        when: "调用方法[organization层]"
        page = roleService.pagingSearch(pageRequest, roleQuery)

        then: "校验参数"
        page.pages != 0
        page.total != 0

        when: "调用方法[project层]"
        page = roleService.pagingSearch(pageRequest, roleQuery)

        then: "校验参数"
        page.pages != 0
        page.total != 0
    }
}
