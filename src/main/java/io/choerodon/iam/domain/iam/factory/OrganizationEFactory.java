package io.choerodon.iam.domain.iam.factory;

import io.choerodon.core.convertor.ApplicationContextHelper;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.oauth.core.password.record.PasswordRecord;

/**
 * @author superlee
 * @data 2018/3/26
 */
public class OrganizationEFactory {

    private OrganizationEFactory() {
    }

    public static OrganizationE createOrganizationE(
            Long id, String name, String code, Long objectVersionNumber, Boolean isEnabled) {
        UserRepository userRepository = ApplicationContextHelper.getSpringFactory().getBean(UserRepository.class);
        PasswordRecord passwordRecord = ApplicationContextHelper.getSpringFactory().getBean(PasswordRecord.class);
        return new OrganizationE(id, name, code, objectVersionNumber, userRepository, isEnabled, passwordRecord);
    }
}
