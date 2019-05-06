package io.choerodon.iam.api.service.impl

import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.service.UserDashboardService
import io.choerodon.iam.api.validator.MemberRoleValidator
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dto.DashboardDTO
import io.choerodon.iam.infra.dto.UserDashboardDTO
import io.choerodon.iam.infra.mapper.DashboardMapper
import io.choerodon.iam.infra.mapper.DashboardRoleMapper
import io.choerodon.iam.infra.mapper.UserDashboardMapper
import org.junit.runner.RunWith
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import spock.lang.Specification

/**
 * @author dengyouquan
 * */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper])
class UserDashboardServiceImplSpec extends Specification {
    private UserDashboardMapper userDashboardMapper = Mock(UserDashboardMapper)
    private DashboardMapper dashboardMapper = Mock(DashboardMapper)
    private DashboardRoleMapper dashboardRoleMapper = Mock(DashboardRoleMapper)
    private MemberRoleValidator memberRoleValidator = Mock(MemberRoleValidator)
    private UserDashboardService userDashboardService
    private Long userId

    def setup() {
        userDashboardService = new UserDashboardServiceImpl(userDashboardMapper,
                dashboardMapper, dashboardRoleMapper, memberRoleValidator)

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())
        userId = DetailsHelper.getUserDetails().getUserId()
    }

    def "Update"() {
        given: "构造参数"
        String level = "site"
        Long sourceId = 1L
        List<UserDashboardDTO> userDashboardList = new ArrayList<>()
        List<DashboardDTO> dashboardEList = new ArrayList<>()
        for (int i = 0; i < 3; i++) {
            DashboardDTO dashboardE = new DashboardDTO()
            dashboardE.setId(i)
            dashboardE.setCode("dashboard")
            dashboardE.setName("dashboard")
            dashboardEList.add(dashboardE)
        }
        for (int i = 0; i < 3; i++) {
            UserDashboardDTO userDashboardDTO = new UserDashboardDTO()
            userDashboardDTO.setUserId(userId)
            userDashboardDTO.setLevel("site")
            userDashboardDTO.setDashboardId(i)
            userDashboardList.add(userDashboardDTO)
        }

        when: "调用方法"
        userDashboardService.update(level, sourceId, userDashboardList)

        then: "校验结果"
        dashboardMapper.selectByLevel(_) >> { dashboardEList }
        1 * userDashboardMapper.selectWithDashboard(_) >> { userDashboardList }
        1 * userDashboardMapper.selectWithDashboardNotExist(_) >> { userDashboardList }
        userDashboardMapper.selectCount(_) >> { 2 }
    }
}
