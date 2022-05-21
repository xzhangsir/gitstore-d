// import gitdownload from './gitdownload'

const gitdownload = require('./gitdownload')

// gitdownload('xzhangsir/gitstore-d#main', 'test/del', {}).then((res) => {
//   console.log(res) //200: success
// })

gitdownload('gitee:zxwaa/vue_object_template', 'test/del', {
  clone: true
}).then((res) => {
  console.log(res) //200: success
})

// https://gitee.com/zxwaa/wangeditor.git
