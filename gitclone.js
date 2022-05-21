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
  '--depth',
  '1',
  'https://github.com/xzhangsir/frontend-bases.git',
  'test/del'
])

// export default gitClone
