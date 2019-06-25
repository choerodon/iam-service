package io.choerodon.iam.api.controller.v1

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dto.BookMarkDTO
import io.choerodon.iam.infra.mapper.BookMarkMapper
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
class BookMarkControllerSpec extends Specification {
    private static String BASE_PATH = "/v1/bookmarks"

    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private BookMarkMapper bookMarkMapper
    @Shared
    def bookMarkList = new ArrayList<BookMarkDTO>()
    @Shared
    def needInit = true
    @Shared
    def needClean = false
    def count = 3

    def setup() {
        if (needInit) {
            given: "构造参数"
            needInit = false
            for (int i = 0; i < count; i++) {
                BookMarkDTO bookMarkDO = new BookMarkDTO()
                bookMarkDO.setUserId(i)
                bookMarkDO.setName("name")
                bookMarkDO.setUrl("url")
                bookMarkDO.setIcon("icon")
                bookMarkDO.setSort(i)
                bookMarkDO.setColor("color")
                bookMarkList.add(bookMarkDO)
            }

            when: "插入数据"
            def result = 0
            for(BookMarkDTO dto :bookMarkList ){
                bookMarkMapper.insert(dto)
                result++
            }
            then: "校验参数"
            result == count
        }
    }

    def cleanup() {
        if (needClean) {
            given: ""
            needClean = false

            when: "删除数据"
            int result = 0
            for (BookMarkDTO bookMarkDO : bookMarkList) {
                result += bookMarkMapper.deleteByPrimaryKey(bookMarkDO)
            }

            then: "校验参数"
            result == count
        }
    }

    def "Create"() {
        given: "构造请求参数"
        BookMarkDTO bookMarkDTO = new BookMarkDTO()
        bookMarkDTO.setUserId(1L)
        bookMarkDTO.setName("name")
        bookMarkDTO.setUrl("url")
        bookMarkDTO.setIcon("icon")
        bookMarkDTO.setSort(1L)
        bookMarkDTO.setColor("color")

        when: "调用方法"
        def entity = restTemplate.postForEntity(BASE_PATH, bookMarkDTO, BookMarkDTO)

        then: "校验参数"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getUserId().equals(0L)
        entity.getBody().getName().equals(bookMarkDTO.getName())
        entity.getBody().getUrl().equals(bookMarkDTO.getUrl())
        entity.getBody().getSort().equals(bookMarkDTO.getSort())
        entity.getBody().getIcon().equals(bookMarkDTO.getIcon())
        entity.getBody().getColor().equals(bookMarkDTO.getColor())
    }

    def "Update"() {
        given: "构造请求参数"
        List<BookMarkDTO> bookMarkDTOList = new ArrayList<>()
        BookMarkDTO bookMarkDTO = bookMarkList.get(0)
        bookMarkDTO.setObjectVersionNumber(1L)
        bookMarkDTOList.add(bookMarkDTO)
        HttpEntity<Object> httpEntity = new HttpEntity<>(bookMarkDTOList)

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH, HttpMethod.PUT, httpEntity, List)

        then: "校验参数"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == bookMarkDTOList.size()
    }

    def "Delete"() {
        HttpEntity<Object> httpEntity = new HttpEntity<>()

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.DELETE, httpEntity, Void, bookMarkList.get(0).getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "List"() {
        given: "构造请求参数"
        needClean = true

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH, List, 1L)

        then: "校验参数"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 1
    }
}
