import fs from 'fs'
export default function gitD(src, opts) {
  return new GitD(src, opts)
}

class GitD {
  constructor(src, opts) {
    this.src = src
  }
  clone() {
    console.log('clone')
  }
}
