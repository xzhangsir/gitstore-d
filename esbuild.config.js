const { resolve } = require('path')
const { build } = require('esbuild')

// 输出文件的位置
const outfile = resolve(__dirname, `./index.js`)
build({
  entryPoints: [resolve(__dirname, `./src/index.js`)],
  outfile,
  bundle: true,
  sourcemap: false,
  minify: true,
  format: 'cjs',
  globalName: 'gitD',
  platform: 'node',
  watch: {
    onRebuild(err) {
      if (!err) console.log('rebuilt~~~~~')
    }
  }
}).then(() => {
  console.log('watching~~~~')
})
