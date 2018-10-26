package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author zmf
 * @since 2018-10-15
 */
@ModifyAudit
@VersionAudit
@Table(name = "IAM_SYSTEM_SETTING")
@Setter
@Getter
public class SystemSettingDO extends AuditDomain {
    @Id
    @GeneratedValue
    @Column(name = "ID")
    private Long id;

    @Column(name = "FAVICON")
    private String favicon;

    @Column(name = "SYSTEM_LOGO")
    private String systemLogo;

    @Column(name = "SYSTEM_TITLE")
    private String systemTitle;

    @Column(name = "SYSTEM_NAME")
    private String systemName;

    @Column(name = "DEFAULT_PASSWORD")
    private String defaultPassword;

    @Column(name = "DEFAULT_LANGUAGE")
    private String defaultLanguage;
}
