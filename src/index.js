import fs from 'fs'
export default function gitD(src, opts) {
  return new GitD(src, opts)
}

class GitD {
  constructor(src, opts) {
    this.src = src
  }
  clone(dir) {
    // 查看目录是不是空的
    console.log(dir)
    this._checkDirIsEmpty(dir)

    // console.log('clone')
  }
  _checkDirIsEmpty(dir) {
    console.log(dir)
    fs.readdir(dir, function (err, files) {
      console.log(files)
    })

    return
    try {
      console.log(dir)
      const files = fs.readdirSync(dir)
      console.log(files)
      return
      if (files.length > 0) {
        if (this.force) {
          this._info({
            code: 'DEST_NOT_EMPTY',
            message: `destination directory is not empty. Using options.force, continuing`
          })
        } else {
          throw new DegitError(
            `destination directory is not empty, aborting. Use options.force to override`,
            {
              code: 'DEST_NOT_EMPTY'
            }
          )
        }
      } else {
        this._verbose({
          code: 'DEST_IS_EMPTY',
          message: `destination directory is empty`
        })
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }
}
