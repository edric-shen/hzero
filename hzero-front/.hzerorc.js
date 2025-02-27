module.exports = {
  "packages": [
    {
      "name": "hzero-front-hadm"
    },
    {
      "name": "hzero-front-hagd"
    },
    {
      "name": "hzero-front-halt"
    },
    {
      "name": "hzero-front-hchg"
    },
    {
      "name": "hzero-front-hdtt"
    },
    {
      "name": "hzero-front-hebk"
    },
    {
      "name": "hzero-front-hexl"
    },
    {
      "name": "hzero-front-hfile"
    },
    {
      "name": "hzero-front-hgat"
    },
    {
      "name": "hzero-front-hiam"
    },
    {
      "name": "hzero-front-himp"
    },
    {
      "name": "hzero-front-hims"
    },
    {
      "name": "hzero-front-hiot"
    },
    {
      "name": "hzero-front-hitf"
    },
    {
      "name": "hzero-front-hivc"
    },
    {
      "name": "hzero-front-hmnt"
    },
    {
      "name": "hzero-front-hmsg"
    },
    {
      "name": "hzero-front-hnlp"
    },
    {
      "name": "hzero-front-hocr"
    },
    {
      "name": "hzero-front-hpay"
    },
    {
      "name": "hzero-front-hpfm"
    },
    {
      "name": "hzero-front-hres"
    },
    {
      "name": "hzero-front-hrpt"
    },
    {
      "name": "hzero-front-hsdr"
    },
    {
      "name": "hzero-front-hsrh"
    },
    {
      "name": "hzero-front-hwfp"
    },
    {
      "name": "hzero-front-hevt"
    },
    {
      "name": "hzero-front-hdsc"
    },
    {
      "name": "hzero-front-hiam-tr"
    },
    {
      "name": "hzero-front-horc"
    },
    {
      "name": "hzero-front-hfnt"
    }
  ],
  "hzeroBoot": "hzero-boot/lib/pathInfo",
  "common": ['hzero-front'],
  // webpackConfig: (config, webpackConfigType) => { // webpack 配置修改
  //   console.log(webpackConfigType); // string webpack配置类型: 'dll' | 'base' | 'ms' ;
  //   config.externals = {
  //     ..config.externals,
  //     jQuery: 'window["jQuery"]',
  //     $: 'window["jQuery"]',
  //   }
  //   return config;
  // },
  // alias: {}, // webpack alias 配置, alias 的值可以是 string 表示指向配置文件
  // theme: {}, // less 变量配置, theme 的值可以是 string 表示指向配置文件
  // hzeroBoot: 'hzero-boot/lib/pathInfo', // hzero入口文件信息配置
  // dllConfig: { // dllConfig 配置
  //   common: {
  //     priority: 100,
  //     packages: ['react','react-dom','dva','dva/router','dva/saga','dva/fetch','hzero-ui','choerodon-ui','choerodon-ui/pro','core-js'],
  //   },
  //   vendorsGraph: {
  //     packages: ['echarts'],
  //   },
  //   vendors: {
  //     packages: ['lodash','lodash-decorators','react-intl-universal','axios','uuid','numeral','react-cropper','cropperjs',]
  //   }
  // },
  // splitChunks:{ /* ... */} // chunks 优化配置 参考: https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
};

