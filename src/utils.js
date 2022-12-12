import fs from 'fs'
import path from 'path'
import { homedir, tmpdir } from 'os'
import child_process from 'child_process'
export const base = path.join(homedir() || tmpdir())

export function mkdirp(dir) {
  const parent = path.dirname(dir)
  if (parent === dir) return

  mkdirp(parent)

  try {
    fs.mkdirSync(dir)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

export function exec(command) {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ stdout, stderr })
    })
  })
}
