const config = {
  local: true, // 是否为本地开发
  clientId: 'localhost', // 必须填入响应的客户端（本地开发）
  titlename: 'Choerodon | 企业数字化服务平台', //  项目页面的title名称
  favicon: 'favicon.ico', //  项目页面的icon图片名称
  theme: {
    'primary-color': '#3F51B5',
  },
  cookieServer: '', //  子域名token共享
  server: 'https://api.choerodon.com.cn',
  fileServer: 'http://minio.staging.saas.hand-china.com',
  webSocketServer: 'ws://notify.staging.saas.hand-china.com',
  dashboard: {
    iam: {
      components: 'src/app/iam/dashboard/*',
      locale: 'src/app/iam/locale/dashboard/*',
    },
  },
  guide: {
    iam: {
      components: 'src/app/iam/guide/*',
      locale: 'src/app/iam/locale/guide/*',
    },
  },
  port: 2233,
  // proxyTarget: 'http://hap4.staging.saas.hand-china.com',
};

module.exports = config;
