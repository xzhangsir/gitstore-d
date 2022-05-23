const {spawn} = require('child_process')
const rm = require('rimraf').sync

function gitClone(httpUrl,targetPath,opts){
    rm(targetPath)
    opts = opts || { delGit:true }

    let args = ["clone"]
    if(opts.checkout){
      args.push('-b',opts.checkout)
    }

    if(opts.shallow){
      args.push('--depth','1')
    }

    args = args.concat(opts.args || [])
    args.push(httpUrl,targetPath)
    
    console.log(args)
    return new Promise((resolve,reject)=>{
        let process = spawn('git', args)
        process.on("close",function(status){
           if(status === 0){
             if(opts.delGit){
               rm(targetPath + "/.git*")
             }
              resolve(status)
           }else{
              reject(status)
           }
        })

    })
     // /^(github|gitee|gitlab|bitbucket):([^#]+)/
}
  

// function gitClone1(opts) {
//    rm(opts[opts.length - 1])
//    console.log(opts)
//   var process = spawn('git', opts)
//   process.on('close', function (status) {
//     console.log(status)
//     if (status == 0) {
//        rm(opts[opts.length - 1] + "/.git*")
//       // if (opts.checkout) {
//       //   _checkout()
//       // } else {
//       //   cb && cb()
//       // }
//     } else {
//       // cb && cb(new Error("'git clone' failed with status " + status))
//     }
//   })
// }

// gitClone1([
//   'clone',
//   // '-b',
//   // 'html_css',
//   // '--depth',
//   // '1',
//   // 'https://github.com/xzhangsir/frontend-bases.git',
//   'https://gitee.com/zxwaa/vue_object_template.git',
//   // '--',
//   // "git@github.com:xzhangsir/frontend-bases.git",
//   // 'https://gitlab.com/savadenn-public/vue',
//   'test/del'
// ])

// export default gitClone

gitClone('https://github.com/xzhangsir/frontend-bases.git','test/del').then(res=>{
  console.log(res)
})
// console.log(123)