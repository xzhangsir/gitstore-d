'use strict'
/**
 * created by xin
 * version 1.0.0
 * createTime 2021-07-13 20:21
 */
const download = require('download')
const gitclone = require('git-clone')
const rm = require('rimraf').sync

function gitdownload(store, dest, opts = {}) {
  let clone = opts.clone || false
  store = normalize(store)
  let url = store.url || getUrl(store, clone)
  console.log(store)
  console.log(url)
  if (clone) {
    rm(dest)
    return new Promise((resolve, reject) => {
      gitclone(
        url,
        dest,
        {
          checkout: store.checkout,
          shallow: store.checkout === 'master',
          ...opts
        },
        (err) => {
          if (err === undefined) {
            rm(dest + '/.git*')
            resolve(200)
          } else {
            reject(new Error(err))
          }
        }
      )
    })
  } else {
    return new Promise((resolve, reject) => {
      download(url, dest, {
        extract: true //解压提取文件
      })
        .then((_) => {
          resolve(200)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  }
}
// 构造下载对象
function normalize(store) {
  var regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/
  var match = regex.exec(store)

  if (match) {
    var directCheckout = match[3] || 'master'
    return { type: 'direct', url: match[2], checkout: directCheckout }
  } else {
    regex =
      /^(?:(github|gitee|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/
    match = regex.exec(store)
    var type = match[1] || 'github'
    var origin = match[2] || null
    var owner = match[3]
    var name = match[4]
    var checkout = match[5] || 'master'

    if (origin == null) {
      if (type === 'github') {
        origin = 'github.com'
      } else if (type === 'gitee') {
        origin = 'gitee.com'
      } else if (type === 'gitlab') {
        origin = 'gitlab.com'
      } else if (type === 'bitbucket') {
        origin = 'bitbucket.org'
      }
    }

    return { type, origin, owner, name, checkout }
  }
}
// 添加协议
function addProtocol({ origin, type }, clone) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) {
      // if (type == 'gitee') {
      //   origin = 'https://' + origin
      // } else {
      origin = 'git@' + origin
      // }
    } else {
      origin = 'https://' + origin
    }
  }
  return origin
}
// 拼接URL
function getUrl(repo, clone) {
  let url,
    origin = addProtocol(repo, clone) // 使用协议获取来源并添加尾部斜杠或冒号（对于ssh）
  origin += /^git@/i.test(origin) ? ':' : '/'
  if (clone) {
    url = origin + repo.owner + '/' + repo.name + '.git'
  } else {
    if (repo.type === 'github') {
      url =
        origin +
        repo.owner +
        '/' +
        repo.name +
        '/archive/refs/heads/' +
        repo.checkout +
        '.zip'
    } else if (repo.type === 'gitee') {
      url =
        origin +
        repo.owner +
        '/' +
        repo.name +
        '/repository/archive/' +
        repo.checkout +
        '.zip'
    } else if (repo.type === 'gitlab') {
      url =
        origin +
        repo.owner +
        '/' +
        repo.name +
        '/repository/archive.zip?ref=' +
        repo.checkout
    } else if (repo.type === 'bitbucket') {
      url =
        origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip'
    }
  }
  return url
}

module.exports = gitdownload
