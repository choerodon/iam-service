package io.choerodon.iam.infra.repository.impl

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.PermissionRepository
import io.choerodon.iam.infra.dto.PermissionDTO
import io.choerodon.iam.infra.mapper.PermissionMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class PermissionRepositoryImplSpec extends Specification {
    private PermissionMapper permissionMapper = Mock(PermissionMapper)
    private PermissionRepository permissionRepository

    def setup() {
        permissionRepository = new PermissionRepositoryImpl(permissionMapper)
    }

    def "UpdateSelective"() {
        given: "构造请求参数"
        PermissionDTO permission = new PermissionDTO()
        permission.setCode("code")
        permission.setPath("path")
        permission.setMethod("method")
        permission.setResourceLevel("site")
        permission.setDescription("description")
        permission.setAction("action")
        permission.setController("resource")
        permission.setPublicAccess(true)
        permission.setLoginAccess(true)
        permission.setWithin(true)
        permission.setServiceCode("serviceName")

        when: "调用方法[异常]"
        permissionRepository.updateSelective(permission)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.permission.update")
        1 * permissionMapper.updateByPrimaryKeySelective(_) >> 0

        when: "调用方法"
        permissionRepository.updateSelective(permission)

        then: "校验结果"
        1 * permissionMapper.updateByPrimaryKeySelective(_) >> 1
        1 * permissionMapper.selectByPrimaryKey(_) >> { new PermissionDTO() }
    }
}
