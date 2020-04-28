module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        /*有一个默认配置 @ 是src的意思*/
        /*在脚手架3是可以@/views这么用的，但是脚手架2不可以这么用*/
        'views': '@/views',
        'components': '@/components',
        'network': '@/network',
        'common': '@/common',
        'assets': '@/assets',
        /*路由暂时不用*/
        /*this.$router this.$store*/
      }
    }
  }
}