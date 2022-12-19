import fs from 'fs'
import path from 'path'
import child_process from 'child_process'

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

export async function fetchRefs(repo) {
  try {
    const { stdout } = await exec(`git ls-remote ${repo.url}`)
    return stdout
      .split('\n')
      .filter(Boolean)
      .map((row) => {
        const [hash, ref] = row.split('\t')
        if (ref === 'HEAD') {
          return {
            type: 'HEAD',
            hash
          }
        }
        const match = /refs\/(\w+)\/(.+)/.exec(ref)
        return {
          type:
            match[1] === 'heads'
              ? 'branch'
              : match[1] === 'refs'
              ? 'ref'
              : match[1],
          name: match[2],
          hash
        }
      })
  } catch (error) {
    throw error
  }
}
