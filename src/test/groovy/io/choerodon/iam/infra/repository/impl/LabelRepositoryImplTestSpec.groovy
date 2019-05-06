package io.choerodon.iam.infra.repository.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.LabelRepository
import io.choerodon.iam.infra.dto.LabelDTO
import io.choerodon.iam.infra.mapper.LabelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LabelRepositoryImplTestSpec extends Specification {
    @Autowired
    private LabelRepository labelRepository
    @Autowired
    private LabelMapper labelMapper

    @Transactional
    def "SelectByPrimaryKey"() {
        given: "构造参数"
        LabelDTO labelDO = new LabelDTO()
        labelDO.setLevel("site")
        labelDO.setType("site")
        labelDO.setName("label")
        labelMapper.insert(labelDO)

        when: "调用方法"
        LabelDTO result = labelRepository.selectByPrimaryKey(labelDO.getId())

        then: "校验结果"
        result.getName().equals(labelDO.getName())
        result.getLevel().equals(labelDO.getLevel())
        result.getType().equals(labelDO.getType())
    }
}
