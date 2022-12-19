import fs from 'fs'
import path from 'path'
import https from 'https'
import { mkdirp, exec, fetchRefs } from './utils'

module.exports = function gitD(src, opts) {
  return new GitD(src, opts)
}
class GitD {
  constructor(src, opts = {}) {
    this.src = src
    this.force = opts.force || false
    this.repo = normalize(src)
  }
  async clone(dest) {
    try {
      this._checkDirIsEmpty(dest)
      return await this._cloneWithGit(this.repo, dest)
    } catch (error) {
      throw error
    }
  }
  async download() {
    try {
      return await this._cloneWithTar(this.repo)
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
          throw '目标目录不为空'
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }
  async _cloneWithGit(repo, dest) {
    let banch = repo.ref === 'HEAD' ? '' : `-b ${repo.ref}`
    await exec(`git clone ${banch} --depth 1 ${repo.url} ${dest}`)
    await exec(`rm -rf ${dest + '/.git*'}`)
    return 200
  }
  async _cloneWithTar(repo) {
    const hash = await this._getHash(repo)
    const file = `${repo.type}/${hash}.tar.gz`
    const url =
      repo.type === 'gitee'
        ? `${repo.url}/repository/archive/${hash}.tar.gz`
        : `${repo.url}/archive/${hash}.tar.gz`
    try {
      fs.statSync(file)
      return 240
    } catch (error) {
      mkdirp(path.dirname(file))
      await fetch(url, file)
      return 200
    }
  }
  async _getHash(repo) {
    try {
      const refs = await fetchRefs(repo)
      if (repo.ref === 'HEAD') {
        return refs.find((ref) => ref.type === 'HEAD').hash
      }
      return this._selectRef(refs, repo.ref)
    } catch (err) {
      throw err
    }
  }
  _selectRef(refs, selector) {
    for (const ref of refs) {
      if (ref.name === selector) {
        return ref.hash
      }
    }
    if (selector.length < 8) return null
    for (const ref of refs) {
      if (ref.hash.startsWith(selector)) return ref.hash
    }
  }
}

// 构造对象
function normalize(store) {
  let regex = /^(?:(github|gitee):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/
  let match = regex.exec(store)
  let type = (match[1] || 'github').replace(/\.(com|org)$/, '')
  let domain = match[2] || null
  let user = match[3]
  let name = match[4].replace('.git', '')
  let ref = match[5] || 'HEAD'

  if (domain === null) {
    domain = `${type}.com`
  }
  let url = `https://${domain}/${user}/${name}`
  return { type, domain, user, name, ref, url }
}

function fetch(url, dest) {
  return new Promise((resolve, reject) => {
    let options = url
    https
      .get(options, (response) => {
        const code = response.statusCode
        if (code >= 400) {
          reject({ code, message: response.statusMessage })
        } else if (code >= 300) {
          fetch(response.headers.location, dest).then(resolve, reject)
        } else {
          response
            .pipe(fs.createWriteStream(dest))
            .on('finish', () => resolve())
            .on('error', reject)
        }
      })
      .on('error', reject)
  })
}
