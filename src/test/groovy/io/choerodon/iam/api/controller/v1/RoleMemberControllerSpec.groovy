package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.ClientRoleSearchDTO
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO
import io.choerodon.iam.api.dto.UploadHistoryDTO
import io.choerodon.iam.infra.dataobject.ClientDO
import io.choerodon.iam.infra.dataobject.MemberRoleDO
import io.choerodon.iam.infra.dataobject.ProjectDO
import io.choerodon.iam.infra.dataobject.RoleDO
import io.choerodon.iam.infra.dataobject.UserDO
import io.choerodon.iam.infra.enums.MemberType
import io.choerodon.iam.infra.mapper.ClientMapper
import io.choerodon.iam.infra.mapper.MemberRoleMapper
import io.choerodon.iam.infra.mapper.ProjectMapper
import io.choerodon.iam.infra.mapper.RoleMapper
import io.choerodon.iam.infra.mapper.UserMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.core.io.Resource
import org.springframework.web.multipart.MultipartFile
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
class RoleMemberControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1"
    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    private MemberRoleMapper memberRoleMapper
    @Autowired
    private RoleMapper roleMapper
    @Autowired
    private UserMapper userMapper
    @Autowired
    private ProjectMapper projectMapper
    @Autowired
    private ClientMapper clientMapper
    @Shared
    def needInit = true
    @Shared
    def needClean = false
    @Shared
    def memberRoleDOList = new ArrayList<MemberRoleDO>()
    @Shared
    def roleDOList = new ArrayList<RoleDO>()
    @Shared
    def userDOList = new ArrayList<UserDO>()
    @Shared
    def clientDOList
    @Shared
    def projectDO = new ProjectDO()

    def setup() {
        if (needInit) {
            given: "构造参数"
            needInit = false
            for (int i = 0; i < 3; i++) {
                RoleDO roleDO = new RoleDO()
                roleDO.setCode("role/site/default/rolemember" + i)
                roleDO.setName("权限管理员")
                roleDO.setLevel("site")
                roleDOList.add(roleDO)
            }
            projectDO.setCode("hand")
            projectDO.setName("汉得")
            projectDO.setOrganizationId(1L)

            when: "插入记录"
            def count = 0
            count += projectMapper.insert(projectDO)
            for (RoleDO roleDO : roleDOList) {
                count += roleMapper.insert(roleDO)
            }
            for (int i = 0; i < 3; i++) {
                UserDO userDO = new UserDO()
                userDO.setLoginName("dengyouquan" + i)
                userDO.setRealName("dengyouquan" + i)
                userDO.setEmail("dengyouquan" + i + "@qq.com")
                userDO.setSourceId(projectDO.getId())
                userDO.setOrganizationId(1L)
                userDOList.add(userDO)
            }
            count += userMapper.insertList(userDOList)
            for (int i = 0; i < 3; i++) {
                MemberRoleDO memberRoleDO = new MemberRoleDO()
                memberRoleDO.setMemberType("user")
                memberRoleDO.setRoleId(roleDOList.get(i).getId())
                memberRoleDO.setSourceType("site")
                memberRoleDO.setSourceId(0)
                memberRoleDO.setMemberId()
                memberRoleDOList.add(memberRoleDO)
            }
            count += memberRoleMapper.insertList(memberRoleDOList)
            clientDOList = initClient()

            then: "校验结果"
            count == 10
        }
    }

    def cleanup() {
        if (needClean) {
            given: ""
            def count = 0
            needClean = false

            when: "删除记录"
            for (MemberRoleDO memberRoleDO : memberRoleDOList) {
                count += memberRoleMapper.deleteByPrimaryKey(memberRoleDO)
            }
            for (UserDO userDO : userDOList) {
                count += userMapper.deleteByPrimaryKey(userDO)
            }
            for (RoleDO roleDO : roleDOList) {
                count += roleMapper.deleteByPrimaryKey(roleDO)
            }

            for (ClientDO clientDO: clientDOList) {
                clientMapper.deleteByPrimaryKey(clientDO)
            }
            count += projectMapper.deleteByPrimaryKey(projectDO)

            then: "校验结果"
            count == 10
        }
    }

    List<ClientDO> initClient() {
        List<ClientDO> clientDOList = new ArrayList<>()
        for (int i = 0; i < 3; i++) {
            ClientDO clientDO = new ClientDO()
            clientDO.setName("client" + i)
            clientDO.setOrganizationId(1L)
            clientMapper.insertSelective(clientDO)
            clientDOList.add(clientDO)
        }

        return clientDOList
    }


    def "CreateOrUpdateOnSiteLevel"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()
        Long[] memberIds = new Long[2]
        memberIds[0] = userDOList.get(0).getId()
        memberIds[1] = userDOList.get(1).getId()
        paramsMap.put("is_edit", true)
        paramsMap.put("member_ids", memberIds)

        when: "调用方法[异常-role id为空]"
        def memberRoleDO = new MemberRoleDO()
        def memberRoleDOList1 = new ArrayList<MemberRoleDO>()
        memberRoleDOList1.add(memberRoleDO)
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.roleId.null")

        when: "调用方法[异常-role不存在]"
        memberRoleDO.setRoleId(1000L)
        entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.role.not.exist")

        when: "调用方法"
        entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList, List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().isEmpty()
    }

    def "CreateOrUpdateClientRoleOnSiteLevel"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()
        Long[] memberIds = new Long[2]
        memberIds[0] = clientDOList.get(0).getId()
        memberIds[1] = clientDOList.get(1).getId()
        paramsMap.put("is_edit", true)
        paramsMap.put("member_ids", memberIds)

        when: "调用方法[异常-role id为空]"
        def memberRoleDO = new MemberRoleDO()
        memberRoleDO.setMemberType(MemberType.CLIENT.value())
        def memberRoleDOList1 = new ArrayList<MemberRoleDO>()
        memberRoleDOList1.add(memberRoleDO)
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.roleId.null")

        when: "调用方法[异常-role不存在]"
        memberRoleDO.setRoleId(1000L)
        entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.role.not.exist")

        when: "调用方法"
        memberRoleDO.setRoleId(roleDOList.get(0).getId())
        memberRoleDO.setMemberType(MemberType.CLIENT.value())
        entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList, String, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() != null
    }

    def "CreateOrUpdateOnOrganizationLevel"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()
        Long[] memberIds = new Long[1]
        memberIds[0] = 1L
        paramsMap.put("organization_id", 1L)
        paramsMap.put("is_edit", true)
        paramsMap.put("member_ids", memberIds)
        MemberRoleDO memberRoleDO = new MemberRoleDO()
        memberRoleDO.setSourceType("organization")
        def memberRoleDOList1 = memberRoleMapper.select(memberRoleDO)

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.roles.in.same.level")

        when: "调用方法"
        def memberIds1 = new Long[1]
        memberIds1[0] = 1L
        paramsMap.put("member_ids", memberIds1)
        entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().isEmpty()

        when: "调用方法"
        def memberIds2 = new Long[1]
        memberIds2[0] = 1L
        paramsMap.put("member_ids", memberIds2)
        paramsMap.put("organization_id", 1L)
        memberRoleDOList1 = new ArrayList<MemberRoleDO>()
        MemberRoleDO memberRoleDO1 = new MemberRoleDO()
        memberRoleDO1.setMemberId(1L)
        memberRoleDO1.setMemberType(MemberType.CLIENT.value())
        memberRoleDO1.setRoleId(2L)
        memberRoleDO1.setSourceId(1L)
        memberRoleDO1.setSourceType("organization")
        memberRoleDOList1.add(memberRoleDO1)
        entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().isEmpty()
    }

//    def "CreateOrUpdateClientRoleOnOrganizationLevel"() {
//        given: "构造参数列表"
//        def paramsMap = new HashMap<String, Object>()
//        Long[] memberIds = new Long[1]
//        memberIds[0] = 1L
//        paramsMap.put("organization_id", 1L)
//        paramsMap.put("is_edit", true)
//        paramsMap.put("member_ids", memberIds)
//        MemberRoleDO memberRoleDO = new MemberRoleDO()
//        memberRoleDO.setSourceType("organization")
//        memberRoleDO.setMemberType(MemberType.CLIENT.value())
//        def memberRoleDOList1 = memberRoleMapper.select(memberRoleDO)
//
//        when: "调用方法"
//        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList, ExceptionResponse, paramsMap)
//
//        then: "校验结果"
//        entity.statusCode.is2xxSuccessful()
//        entity.getBody().getCode() == "error.roles.in.same.level"
//
//        when: "调用方法"
//        def memberIds1 = new Long[1]
//        memberIds1[0] = 1L
//        paramsMap.put("member_ids", memberIds1)
//        entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, List, paramsMap)
//
//        then: "校验结果"
//        entity.statusCode.is2xxSuccessful()
//        !entity.getBody().isEmpty()
//
//        when: "调用方法"
//        def memberIds2 = new Long[1]
//        memberIds2[0] = 1L
//        paramsMap.put("member_ids", memberIds2)
//        paramsMap.put("organization_id", 1L)
//        memberRoleDOList1 = new ArrayList<MemberRoleDO>()
//        MemberRoleDO memberRoleDO1 = new MemberRoleDO()
//        memberRoleDO1.setMemberId(1L)
//        memberRoleDO1.setMemberType("client")
//        memberRoleDO1.setRoleId(2L)
//        memberRoleDO1.setSourceId(1L)
//        memberRoleDO1.setSourceType("organization")
//        memberRoleDOList1.add(memberRoleDO1)
//        entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, List, paramsMap)
//
//        then: "校验结果"
//        entity.statusCode.is2xxSuccessful()
//        !entity.getBody().isEmpty()
//    }

    def "CreateOrUpdateOnProjectLevel"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()
        Long[] memberIds = new Long[1]
        memberIds[0] = 1L
        paramsMap.put("project_id", 1L)
        paramsMap.put("is_edit", true)
        paramsMap.put("member_ids", memberIds)
        MemberRoleDO memberRoleDO = new MemberRoleDO()
        memberRoleDO.setSourceType("project")
        //null
        def memberRoleDOList1 = memberRoleMapper.select(memberRoleDO)

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, String, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()

        when: "调用方法"
        memberRoleDO.setMemberType(MemberType.CLIENT.value())
        entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members?is_edit={is_edit}&member_ids={member_ids}", memberRoleDOList1, String, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "PagingQueryUsersByRoleIdOnSiteLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleId = roleDOList.get(0).getId()
        paramsMap.put("role_id", roleId)
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/users?role_id={role_id}", roleAssignmentSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() != 0
    }

    def "PagingQueryClientsByRoleIdOnSiteLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleId = roleDOList.get(0).getId()
        paramsMap.put("role_id", roleId)
        def clientRoleSearchDTO = new ClientRoleSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/clients?role_id={role_id}", clientRoleSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() != null
    }

    def "PagingQueryUsersByRoleIdOnOrganizationLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleId = roleDOList.get(0).getId()
        paramsMap.put("role_id", roleId)
        paramsMap.put("organization_id", 1L)
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/users?role_id={role_id}", roleAssignmentSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().isEmpty()
    }

    def "PagingQueryClientsByRoleIdOnOrganizationLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleId = roleDOList.get(0).getId()
        paramsMap.put("role_id", roleId)
        paramsMap.put("organization_id", 1L)
        def clientRoleSearchDTO = new ClientRoleSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/clients?role_id={role_id}", clientRoleSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().isEmpty()
    }

    def "PagingQueryUsersByRoleIdOnProjectLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleId = roleDOList.get(0).getId()
        paramsMap.put("role_id", roleId)
        paramsMap.put("project_id", projectDO.getId())
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/users?role_id={role_id}", roleAssignmentSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        //只有site用户
        entity.getBody().isEmpty()
    }

    def "PagingQueryClientsByRoleIdOnProjectLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleId = roleDOList.get(0).getId()
        paramsMap.put("role_id", roleId)
        paramsMap.put("project_id", projectDO.getId())
        def clientRoleSearchDTO = new ClientRoleSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/clients?role_id={role_id}", clientRoleSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        //只有site用户
        entity.getBody().isEmpty()
    }

    def "DeleteOnSiteLevel"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()
        def roleAssignmentDeleteDTO = new RoleAssignmentDeleteDTO()
        roleAssignmentDeleteDTO.setSourceId(0)
        roleAssignmentDeleteDTO.setMemberType("user")
        roleAssignmentDeleteDTO.setView("userId")
        List<Long> roleIds = new ArrayList<>()
        roleIds.add(roleDOList.get(0).getId())
        roleIds.add(roleDOList.get(1).getId())
        roleIds.add(roleDOList.get(2).getId())
        def map = new HashMap<Long, List<Long>>()
        map.put(userDOList.get(0).getId(), roleIds)
        roleAssignmentDeleteDTO.setData(map)

        when: "调用方法[异常-view不合法]"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/delete", roleAssignmentDeleteDTO, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.member_role.view.illegal")

        when: "调用方法"
        roleAssignmentDeleteDTO.setView("userView")
        entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/delete", roleAssignmentDeleteDTO, Void, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "DeleteOnOrganizationLevel"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()
        def roleAssignmentDeleteDTO = new RoleAssignmentDeleteDTO()
        roleAssignmentDeleteDTO.setSourceId(0)
        roleAssignmentDeleteDTO.setMemberType("user")
        roleAssignmentDeleteDTO.setView("userView")
        List<Long> roleIds = new ArrayList<>()
        roleIds.add(roleDOList.get(0).getId())
        roleIds.add(roleDOList.get(1).getId())
        roleIds.add(roleDOList.get(2).getId())
        def map = new HashMap<Long, List<Long>>()
        map.put(userDOList.get(0).getId(), roleIds)
        roleAssignmentDeleteDTO.setData(map)
        paramsMap.put("organization_id", 1L)

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/delete", roleAssignmentDeleteDTO, Void, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "DeleteOnProjectLevel"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()
        def roleAssignmentDeleteDTO = new RoleAssignmentDeleteDTO()
        roleAssignmentDeleteDTO.setSourceId(0)
        roleAssignmentDeleteDTO.setMemberType("user")
        roleAssignmentDeleteDTO.setView("userView")
        List<Long> roleIds = new ArrayList<>()
        roleIds.add(roleDOList.get(0).getId())
        roleIds.add(roleDOList.get(1).getId())
        roleIds.add(roleDOList.get(2).getId())
        def map = new HashMap<Long, List<Long>>()
        map.put(userDOList.get(0).getId(), roleIds)
        roleAssignmentDeleteDTO.setData(map)
        paramsMap.put("project_id", 1L)

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/delete", roleAssignmentDeleteDTO, Void, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "ListRolesWithUserCountOnSiteLevel"() {
        given: "构造请求参数"
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/users/count", roleAssignmentSearchDTO, List)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().isEmpty()
    }

    def "ListRolesWithClientCountOnSiteLevel"() {
        given: "构造请求参数"
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/clients/count", roleAssignmentSearchDTO, List)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().isEmpty()
    }

    def "ListRolesWithUserCountOnOrganizationLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", 1L)
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/users/count", roleAssignmentSearchDTO, List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 2
    }
    def "ListRolesWithClientCountOnOrganizationLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", 1L)
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/clients/count", roleAssignmentSearchDTO, List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() != null
    }

    def "ListRolesWithUserCountOnProjectLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectDO.getId())
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/users/count", roleAssignmentSearchDTO, List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 4
    }

    def "ListRolesWithClientCountOnProjectLevel"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectDO.getId())
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/clients/count", roleAssignmentSearchDTO, List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() != null
    }

    def "PagingQueryUsersWithSiteLevelRoles"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/users/roles", roleAssignmentSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() != 0
    }

    def "PagingQueryClientsWithSiteLevelRoles"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/clients/roles", roleAssignmentSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() != null
    }

    def "PagingQueryUsersWithOrganizationLevelRoles"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", 1L)
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/users/roles", roleAssignmentSearchDTO, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        //自己插入的userDO
        entity.getBody().size() != 0
    }

    def "pagingQueryClientsWithOrganizationLevelRoles"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", 1L)
        def clientSearch = new ClientRoleSearchDTO()
        clientSearch.setClientName("client")
        clientSearch.setRoleName("管理")

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/clients/roles", clientSearch, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() != 0
    }

    def "PagingQueryUsersWithProjectLevelRoles"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectDO.getId())
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/users/roles", roleAssignmentSearchDTO, String, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() != null
    }

    def "PagingQueryClientsWithProjectLevelRoles"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectDO.getId())
        def roleAssignmentSearchDTO = new RoleAssignmentSearchDTO()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/clients/roles", roleAssignmentSearchDTO, String, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() != null
    }

    def "GetUserWithOrgLevelRolesByUserId"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("user_id", userDOList.get(0).getId())
        paramsMap.put("organization_id", 1L)

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/users/{user_id}", List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        //!entity.getBody().isEmpty()
    }

    def "GetUserWithProjLevelRolesByUserId"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("user_id", userDOList.get(0).getId())
        paramsMap.put("project_id", projectDO.getId())

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/projects/{project_id}/role_members/users/{user_id}", List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().isEmpty()
    }

    def "DownloadTemplatesOnSite"() {
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/site/role_members/download_templates", Resource)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().exists()
    }

    def "DownloadTemplatesOnOrganization"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", 1L)

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/download_templates", Resource, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().exists()
    }

    def "DownloadTemplatesOnProject"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectDO.getId())

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/projects/{project_id}/role_members/download_templates", Resource, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().exists()
    }

    def "Import2MemberRoleOnSite"() {
        given: "构造请求参数"
        MultipartFile file = null
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/site/role_members/batch_import", file, Void, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "Import2MemberRoleOnOrganization"() {
        given: "构造请求参数"
        MultipartFile file = null
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("organization_id", 1L)

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/organizations/{organization_id}/role_members/batch_import", file, Void, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "Import2MemberRoleOnProject"() {
        given: "构造请求参数"
        MultipartFile file = null
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("project_id", projectDO.getId())

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH + "/projects/{project_id}/role_members/batch_import", file, Void, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "LatestHistoryOnSite"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("user_id", userDOList.get(0).getId())

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/site/member_role/users/{user_id}/upload/history", UploadHistoryDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "LatestHistoryOnOrganization"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("user_id", userDOList.get(0).getId())
        paramsMap.put("organization_id", 1L)

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/organizations/{organization_id}/member_role/users/{user_id}/upload/history", UploadHistoryDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "LatestHistoryOnProject"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("user_id", userDOList.get(0).getId())
        paramsMap.put("project_id", projectDO.getId())

        when: "调用方法"
        needClean = true
        def entity = restTemplate.getForEntity(BASE_PATH + "/projects/{project_id}/member_role/users/{user_id}/upload/history", UploadHistoryDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
