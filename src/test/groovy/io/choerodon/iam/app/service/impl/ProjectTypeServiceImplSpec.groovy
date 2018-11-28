package io.choerodon.iam.app.service.impl

import io.choerodon.iam.api.service.impl.ProjectTypeServiceImpl
import io.choerodon.iam.infra.dataobject.ProjectTypeDO
import io.choerodon.iam.infra.mapper.ProjectTypeMapper
import spock.lang.Specification

class ProjectTypeServiceImplSpec extends Specification {

    def "test list"() {
        given:
        def project = new ProjectTypeDO('code')
        project.setName("name")
        project.setDescription("desc")
        def projectTypeMapper = Mock(ProjectTypeMapper) {

            selectAll() >> [project]
        }
        def projectTypeService = new ProjectTypeServiceImpl(projectTypeMapper)


        when:
        def list = projectTypeService.list()

        then:
        list != null
        list.size() == 1
        list.get(0).code == project.getCode()
        list.get(0).name == project.getName()
        list.get(0).description == project.getDescription()
    }
}
