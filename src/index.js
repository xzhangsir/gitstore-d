import fs from 'fs'
import path from 'path'
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
    this.repo = parse(src)
    // this.mode = opts.mode || this.repo.mode
  }
  async clone(dest) {
    // 查看目录是不是空的
    this._checkDirIsEmpty(dest)
    // const { repo } = this
    // const dir = path.join(base, repo.site, repo.user, repo.name)
    await this._cloneWithGit(dest)

    // console.log('clone')
  }
  _checkDirIsEmpty(dir) {
    try {
      // console.log(dir)
      const files = fs.readdirSync(dir)
      // console.log(files)
      if (files.length > 0) {
        if (this.force) {
          // this._info({
          //   code: 'DEST_NOT_EMPTY',
          //   message: `destination directory is not empty. Using options.force, continuing`
          // })
          console.log('目标目录不为空。使用force选项继续')
        } else {
          // throw new DegitError(
          //   `destination directory is not empty, aborting. Use options.force to override`,
          //   {
          //     code: 'DEST_NOT_EMPTY'
          //   }
          // )
          console.log('目标目录不为空')
        }
      } else {
        // this._verbose({
        //   code: 'DIR_IS_EMPTY',
        //   message: `destination directory is empty`
        // })
        console.log('success')
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }
  async _cloneWithGit(dest) {
    // await exec(`git clone ${this.repo.url} ${dest}`)
    await exec(`git clone https://gitee.com/zxwaa/feisen.git ${dest}`)
    await exec(`rm -rf ${dest + '/.git*'}`)
  }
}

const supported = new Set([
  'github',
  'gitee',
  'gitlab',
  'bitbucket',
  'git.sr.ht'
])

function parse(src) {
  const match =
    /^(?:(?:https:\/\/)?([^:/]+\.[^:/]+)\/|git@([^:/]+)[:/]|([^/]+):)?([^/\s]+)\/([^/\s#]+)(?:((?:\/[^/\s#]+)+))?(?:\/)?(?:#(.+))?/.exec(
      src
    )
  if (!match) {
    // throw new DegitError(`could not parse ${src}`, {
    //   code: 'BAD_SRC'
    // })
  }

  const site = (match[1] || match[2] || match[3] || 'github').replace(
    /\.(com|org)$/,
    ''
  )
  if (!supported.has(site)) {
    // throw new DegitError(
    //   `degit supports GitHub, GitLab, Sourcehut and BitBucket`,
    //   {
    //     code: 'UNSUPPORTED_HOST'
    //   }
    // )
  }

  const user = match[4]
  const name = match[5].replace(/\.git$/, '')
  const subdir = match[6]
  const ref = match[7] || 'HEAD'

  const domain = `${site}.${
    site === 'bitbucket' ? 'org' : site === 'git.sr.ht' ? '' : 'com'
  }`
  const url = `https://${domain}/${user}/${name}`
  const ssh = `git@${domain}:${user}/${name}`

  const mode = supported.has(site) ? 'tar' : 'git'

  return { site, user, name, ref, url, ssh, subdir, mode }
}
