const { resolve } = require('path')
const { build } = require('esbuild')
const format = 'cjs'
//输出文件的格式
const outputFormat = {
  global: 'iife', //   iife  立即执行函数 (function(){})()
  cjs: 'cjs', // node中的模块 module.exports
  esm: 'esm' // 浏览器中的esModule模块  import
}[format]
// 输出文件的位置
const outfile = resolve(__dirname, `./dist/index.js`)
build({
  entryPoints: [resolve(__dirname, `./src/index.js`)],
  outfile,
  bundle: true, //把所有的包全部打包到一起
  sourcemap: true,
  format: outputFormat,
  globalName: 'gitD',
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    //监控文件变化
    onRebuild(err) {
      if (!err) console.log('rebuilt~~~~~')
    }
  }
}).then(() => {
  console.log('watching~~~~')
})
