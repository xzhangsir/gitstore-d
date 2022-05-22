var spawn = require('child_process').spawn

function gitClone(opts) {
  var process = spawn('git', opts)
  process.on('close', function (status) {
    console.log(status)
    if (status == 0) {
      // if (opts.checkout) {
      //   _checkout()
      // } else {
      //   cb && cb()
      // }
    } else {
      // cb && cb(new Error("'git clone' failed with status " + status))
    }
  })
}

gitClone([
  'clone',
  // '-b',
  // 'html_css',
  // '--depth',
  // '1',
  // 'https://github.com/xzhangsir/frontend-bases.git',
  // 'https://gitee.com/zxwaa/vue_object_template.git',
  'https://gitlab.com/savadenn-public/vue',
  'test/del'
])

// export default gitClone
