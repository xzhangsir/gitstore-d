var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.js
var import_fs = __toESM(require("fs"));

// src/utils.js
var import_path = __toESM(require("path"));
var import_os = require("os");
var import_child_process = __toESM(require("child_process"));
var base = import_path.default.join((0, import_os.homedir)() || (0, import_os.tmpdir)());
function exec(command) {
  return new Promise((resolve, reject) => {
    import_child_process.default.exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// src/index.js
module.exports = function gitD(src, opts) {
  return new GitD(src, opts);
};
var GitD = class {
  constructor(src, opts = {}) {
    this.src = src;
    this.proxy = process.env.https_proxy;
    this.force = opts.force || false;
    this.repo = normalize(src);
  }
  async clone(dest) {
    console.log(this.repo);
    try {
      this._checkDirIsEmpty(dest);
      await this._cloneWithGit(dest);
    } catch (error) {
      throw error;
    }
  }
  async _checkDirIsEmpty(dir) {
    try {
      const files = import_fs.default.readdirSync(dir);
      if (files.length > 0) {
        if (this.force) {
          await exec(`rm -rf ${dir}`);
        } else {
          throw "\u76EE\u6807\u76EE\u5F55\u4E0D\u4E3A\u7A7A";
        }
      }
    } catch (err) {
      if (err.code !== "ENOENT")
        throw err;
    }
  }
  async _cloneWithGit(dest) {
    await exec(`git clone ${this.repo.url} ${dest}`);
    await exec(`rm -rf ${dest + "/.git*"}`);
  }
};
function normalize(store) {
  let regex = /^(?:(github|gitee|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
  let match = regex.exec(store);
  let type = (match[1] || "github").replace(/\.(com|org)$/, "");
  let domain = match[2] || null;
  let user = match[3];
  let name = match[4];
  let branch = match[5] || "main";
  if (domain === null) {
    domain = `${type}.${type === "bitbucket" ? "org" : "com"}`;
  }
  let url = `https://${domain}/${user}/${name}`;
  return { type, domain, user, name, branch, url };
}
//# sourceMappingURL=index.js.map
