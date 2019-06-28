const config = {
  server: 'http://api.alpha.saas.hand-china.com',
  // server: 'http://api.c7nf.choerodon.staging.saas.hand-china.com',
  master: '@choerodon/master',
  projectType: 'choerodon',
  buildType: 'single',
  dashboard: {
    iam: {
      components: 'react/src/app/iam/dashboard/*',
      locale: 'react/src/app/iam/locale/dashboard/*',
    },
  },
  resourcesLevel: ['site', 'organization', 'project', 'user'],
};

module.exports = config;
