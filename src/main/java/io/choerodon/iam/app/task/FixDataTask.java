package io.choerodon.iam.app.task;

import io.choerodon.asgard.schedule.QuartzDefinition;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.asgard.schedule.annotation.TimedTask;
import io.choerodon.core.iam.ResourceLevel;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 重构iam表结构后修复数据任务
 *
 * @author superlee
 * @since 2019-04-24
 */
@Component
public class FixDataTask {

    private FixDataHelper fixDataHelper;

    public FixDataTask(FixDataHelper fixDataHelper) {
        this.fixDataHelper = fixDataHelper;
    }

    @TimedTask(name = "重构iam表结构后修复数据，只执行一次", description = "重构iam表结构后修复数据，只执行一次",
            oneExecution = true, params = {}, repeatCount = 0, repeatInterval = 0, repeatIntervalUnit = QuartzDefinition.SimpleRepeatIntervalUnit.SECONDS)
    @JobTask(maxRetryCount = 3, code = "fixData", level = ResourceLevel.SITE, description = "重构iam表结构后修复数据任务")
    public void fixData(Map<String, Object> map) {
        fixDataHelper.fix();
    }

}
