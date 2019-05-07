package io.choerodon.iam.api.controller.v1

import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dto.MenuDTO
import io.choerodon.iam.infra.mapper.MenuMapper
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
class MenuControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/menus"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private MenuMapper menuMapper
    @Shared
    def needInit = true
    @Shared
    def needClean = false
    @Shared
    def menuDOList = new ArrayList<MenuDTO>()

    def setup() {
        if (needInit) {
            given: "构造参数"
            needInit = false
            for (int i = 0; i < 3; i++) {
                MenuDTO menuDO = new MenuDTO()
                menuDO.setCode("choerodon.code.testroot" + i)
                menuDO.setName("菜单测试" + i)
                menuDO.setResourceLevel("site")
                menuDO.setParentCode("parent")
                menuDO.setType("root")
                menuDO.setIcon("icon")
                menuDO.setDefault(true)
                menuDOList.add(menuDO)
            }
            for (int i = 0; i < 3; i++) {
                MenuDTO menuDO = new MenuDTO()
                menuDO.setCode("choerodon.code.testmenu" + i)
                menuDO.setName("菜单测试" + i)
                menuDO.setResourceLevel("site")
                menuDO.setParentCode("parent")
                menuDO.setType("menu")
                menuDO.setIcon("icon")
                menuDOList.add(menuDO)
            }

            when: "插入记录"
            //不能insertList，否则不能插入多语言表
            def count = 0
            for (MenuDTO menuDO : menuDOList) {
                menuMapper.insert(menuDO)
            }

            then: "校验结果"
            count == 6
        }
    }

    def cleanup() {
        if (needClean) {
            given: ""
            needClean = false
            def count = 0

            when: "删除记录"
            for (MenuDTO menuDO : menuDOList) {
                count += menuMapper.deleteByPrimaryKey(menuDO)
            }

            then: "校验结果"
            count == 6
        }
    }

    def "Query"() {
        given: "构造请求参数"
        def menuId = menuDOList.get(0).getId()

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{menu_id}", MenuDTO, menuId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(menuDOList.get(0).getId())
        entity.getBody().getCode().equals(menuDOList.get(0).getCode())
        entity.getBody().getName().equals(menuDOList.get(0).getName())
        entity.getBody().getLevel().equals(menuDOList.get(0).getLevel())
        entity.getBody().getParentId().equals(menuDOList.get(0).getParentId())
    }

    def "Create"() {
        given: "构造请求参数"
        def menuDTO = ConvertHelper.convert(menuDOList.get(0), MenuDTO)

        when: "调用方法[异常-不合法type]"
        def menuDTO1 = new MenuDTO()
        BeanUtils.copyProperties(menuDTO, menuDTO1)
        menuDTO1.setType("error")
        def entity = restTemplate.postForEntity(BASE_PATH, menuDTO1, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menuType.illegal")

        when: "调用方法[异常-不合法level]"
        def menuDTO2 = new MenuDTO()
        BeanUtils.copyProperties(menuDTO, menuDTO2)
        menuDTO2.setLevel("error")
        entity = restTemplate.postForEntity(BASE_PATH, menuDTO2, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.level.illegal")

        when: "调用方法[异常-menu code存在]"
        def menuDTO3 = new MenuDTO()
        BeanUtils.copyProperties(menuDTO, menuDTO3)
        entity = restTemplate.postForEntity(BASE_PATH, menuDTO3, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menuCode.exist")

        when: "调用方法[异常-menu code存在]"
        def menuDTO4 = new MenuDTO()
        BeanUtils.copyProperties(menuDTO, menuDTO4)
        menuDTO4.setCode("create")
        menuDTO4.setId(null)
        entity = restTemplate.postForEntity(BASE_PATH, menuDTO4, MenuDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(menuDTO4.getCode())
        entity.getBody().getName().equals(menuDTO4.getName())
        entity.getBody().getLevel().equals(menuDTO4.getLevel())
        entity.getBody().getParentId().equals(menuDTO4.getParentId())
    }

    def "Update"() {
        given: "构造请求参数"
        def menuDTO = ConvertHelper.convert(menuDOList.get(5), MenuDTO)

        when: "调用方法"
        def menuDTO1 = new MenuDTO()
        BeanUtils.copyProperties(menuDTO, menuDTO1)
        menuDTO1.setId(1000L)
        def httpEntity = new HttpEntity<MenuDTO>(menuDTO1)
        def entity = restTemplate.exchange(BASE_PATH + "/{menu_id}", HttpMethod.POST, httpEntity, ExceptionResponse, menuDTO1.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.not.exist")

        when: "调用方法"
        def menuDTO2 = new MenuDTO()
        BeanUtils.copyProperties(menuDTO, menuDTO2)
        menuDTO2.setObjectVersionNumber(1)
        httpEntity = new HttpEntity<MenuDTO>(menuDTO2)
        entity = restTemplate.exchange(BASE_PATH + "/{menu_id}", HttpMethod.POST, httpEntity, MenuDTO, menuDTO2.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(menuDTO2.getId())
        entity.getBody().getCode().equals(menuDTO2.getCode())
        entity.getBody().getName().equals(menuDTO2.getName())
        entity.getBody().getLevel().equals(menuDTO2.getLevel())
        entity.getBody().getParentId().equals(menuDTO2.getParentId())
    }

    def "Delete"() {
        given: "构造请求参数"
        def menuDTO = ConvertHelper.convert(menuDOList.get(1), MenuDTO)

        when: "调用方法[异常-有子菜单]"
        def menuDTO1 = ConvertHelper.convert(menuDOList.get(0), MenuDTO)
        def httpEntity = new HttpEntity<MenuDTO>(menuDTO1)
        def entity = restTemplate.exchange(BASE_PATH + "/{menu_id}", HttpMethod.DELETE, httpEntity, ExceptionResponse, menuDTO1.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.have.children")

        when: "调用方法[异常-菜单不存在]"
        def menuDTO2 = new MenuDTO()
        menuDTO2.setId(1000L)
        httpEntity = new HttpEntity<MenuDTO>(menuDTO2)
        entity = restTemplate.exchange(BASE_PATH + "/{menu_id}", HttpMethod.DELETE, httpEntity, ExceptionResponse, menuDTO2.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.not.exist")

        when: "调用方法[异常-菜单是默认的]"
        def menuDTO3 = new MenuDTO()
        BeanUtils.copyProperties(menuDTO, menuDTO3)
        httpEntity = new HttpEntity<MenuDTO>(menuDTO3)
        entity = restTemplate.exchange(BASE_PATH + "/{menu_id}", HttpMethod.DELETE, httpEntity, ExceptionResponse, menuDTO3.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.default")

        when: "调用方法"
        def menuDTO4 = ConvertHelper.convert(menuDOList.get(5), MenuDTO)
        httpEntity = new HttpEntity<MenuDTO>(menuDTO4)
        entity = restTemplate.exchange(BASE_PATH + "/{menu_id}", HttpMethod.DELETE, httpEntity, Boolean, menuDTO4.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody()
    }

    def "ListTreeMenusWithPermissions"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def level = "site"
        def testPermission = false
        paramsMap.put("level", level)
        paramsMap.put("test_permission", testPermission)

        when: "调用方法[异常-level不合法]"
        paramsMap.put("level", "error")
        def entity = restTemplate.getForEntity(BASE_PATH + "/tree?test_permission={test_permission}&level={level}", ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.level.illegal")

        when: "调用方法"
        paramsMap.put("level", level)
        entity = restTemplate.getForEntity(BASE_PATH + "/tree?test_permission={test_permission}&level={level}", List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 4
    }

    def "ListAfterTestPermission"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def level = "site"
        def sourceId = 0
        paramsMap.put("level", level)
        paramsMap.put("source_id", sourceId)

        when: "调用方法[异常-level不合法]"
        paramsMap.put("level", "error")
        def entity = restTemplate.getForEntity(BASE_PATH + "?source_id={source_id}&level={level}", ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.level.illegal")

        when: "调用方法"
        paramsMap.put("level", level)
        entity = restTemplate.getForEntity(BASE_PATH + "?source_id={source_id}&level={level}", List, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 4
    }

    def "SaveListTree"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def level = "site"
        def testPermission = false
        paramsMap.put("level", level)
        paramsMap.put("test_permission", testPermission)
        def entity = restTemplate.getForEntity(BASE_PATH + "/tree?test_permission={test_permission}&level={level}", List, paramsMap)
        def updateMenuDTOList = entity.getBody()

        when: "调用方法"
        entity = restTemplate.postForEntity(BASE_PATH + "/tree?level={level}", updateMenuDTOList, List, paramsMap)


        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 4
    }

    def "Check"() {
        given: "构造请求参数"
        def menuDTO = new MenuDTO()

        when: "调用方法[异常-菜单编码为空]"
        def entity = restTemplate.postForEntity(BASE_PATH + "/check", menuDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.code.empty")

        when: "调用方法[异常-菜单level为空]"
        menuDTO.setCode("check")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", menuDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.level.empty")

        when: "调用方法[异常-菜单type为空]"
        menuDTO.setCode("check")
        menuDTO.setLevel("site")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", menuDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.type.empty")

        when: "调用方法[异常-菜单重复]"
        menuDTO.setCode("choerodon.code.testroot1")
        menuDTO.setLevel("site")
        menuDTO.setType("root")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", menuDTO, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.menu.code-level-type.exist")

        when: "调用方法"
        menuDTO.setCode("check")
        menuDTO.setLevel("site")
        menuDTO.setType("root")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", menuDTO, Void)
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
