module.exports = {
  alias: {
    '@src': `${__dirname}/src`,
    '@less': `${__dirname}/src/less`,
    '@components': `${__dirname}/src/components`
  },
  extraBabelPlugins: [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ]
}
