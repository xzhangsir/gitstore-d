import fs from 'fs'
import path from 'path'
import https from 'https'
import { mkdirp, base, exec } from './utils'

module.exports = function gitD(src, opts) {
  return new GitD(src, opts)
}
// export default function gitD(src, opts) {
//   return new GitD(src, opts)
// }

class GitD {
  constructor(src, opts = {}) {
    this.src = src
    this.proxy = process.env.https_proxy
    this.force = opts.force || false
    this.repo = normalize(src)
    // this.mode = opts.mode || this.repo.mode
  }
  async clone(dest) {
    // console.log(this.repo)
    try {
      // 查看目录是不是空的
      this._checkDirIsEmpty(dest)
      await this._cloneWithGit(dest)
    } catch (error) {
      throw error
    }
  }
  async download(dest) {
    console.log(this.repo)
    try {
      // 查看目录是不是空的
      this._checkDirIsEmpty(dest)
      await this._cloneWithTar(dest)
    } catch (error) {
      throw error
    }
  }
  async _checkDirIsEmpty(dir) {
    try {
      const files = fs.readdirSync(dir)
      if (files.length > 0) {
        if (this.force) {
          await exec(`rm -rf ${dir}`)
        } else {
          // throw new Error('目标目录不为空')
          throw '目标目录不为空'
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }
  async _cloneWithGit(dest) {
    await exec(`git clone --depth 1 ${this.repo.url} ${dest}`)
    // await exec(`git clone https://gitee.com/zxwaa/feisen.git ${dest}`)
    await exec(`rm -rf ${dest + '/.git*'}`)
  }
  async _cloneWithTar(dest) {
    // 下载
    let { domain, user, name } = this.repo

    // console.log(dest)
    // let url = `https://${domain}/${user}/${name.replace(
    //   '.git',
    //   ''
    // )}repository/archive/master.zip`
    let url = `https://github.com/xzhangsir/vue2-core-study/archive/refs/heads/main.zip`
    // let url = `https://gitee.com/zxwaa/feisen/repository/archive/master.zip`
    console.log(url)
    await fetch(url, dest)
  }
}

const supported = new Set([
  'github',
  'gitee',
  'gitlab',
  'bitbucket',
  'git.sr.ht'
])

// 构造下载对象
function normalize(store) {
  let regex =
    /^(?:(github|gitee|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/
  let match = regex.exec(store)
  let type = (match[1] || 'github').replace(/\.(com|org)$/, '')
  let domain = match[2] || null
  let user = match[3]
  let name = match[4]
  let branch = match[5] || 'main'

  if (domain === null) {
    domain = `${type}.${type === 'bitbucket' ? 'org' : 'com'}`
  }
  let url = `https://${domain}/${user}/${name}`
  return { type, domain, user, name, branch, url }
}

function fetch(url, dest) {
  return new Promise((fulfil, reject) => {
    let options = url

    // if (proxy) {
    //   const parsedUrl = URL.parse(url)
    //   options = {
    //     hostname: parsedUrl.host,
    //     path: parsedUrl.path,
    //     agent: new Agent(proxy)
    //   }
    // }

    https
      .get(options, (response) => {
        const code = response.statusCode
        if (code >= 400) {
          reject({ code, message: response.statusMessage })
        } else if (code >= 300) {
          fetch(response.headers.location, dest).then(fulfil, reject)
        } else {
          response
            .pipe(fs.createWriteStream(dest + '.zip'))
            .on('finish', () => fulfil())
            .on('error', reject)
        }
      })
      .on('error', reject)
  })
}
