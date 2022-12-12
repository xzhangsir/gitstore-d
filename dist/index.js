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
    this.repo = parse(src);
  }
  async clone(dest) {
    this._checkDirIsEmpty(dest);
    await this._cloneWithGit(dest);
  }
  _checkDirIsEmpty(dir) {
    try {
      const files = import_fs.default.readdirSync(dir);
      if (files.length > 0) {
        if (this.force) {
          console.log("\u76EE\u6807\u76EE\u5F55\u4E0D\u4E3A\u7A7A\u3002\u4F7F\u7528force\u9009\u9879\u7EE7\u7EED");
        } else {
          console.log("\u76EE\u6807\u76EE\u5F55\u4E0D\u4E3A\u7A7A");
        }
      } else {
        console.log("success");
      }
    } catch (err) {
      if (err.code !== "ENOENT")
        throw err;
    }
  }
  async _cloneWithGit(dest) {
    await exec(`git clone https://gitee.com/zxwaa/feisen.git ${dest}`);
    await exec(`rm -rf ${dest + "/.git*"}`);
  }
};
var supported = /* @__PURE__ */ new Set([
  "github",
  "gitee",
  "gitlab",
  "bitbucket",
  "git.sr.ht"
]);
function parse(src) {
  const match = /^(?:(?:https:\/\/)?([^:/]+\.[^:/]+)\/|git@([^:/]+)[:/]|([^/]+):)?([^/\s]+)\/([^/\s#]+)(?:((?:\/[^/\s#]+)+))?(?:\/)?(?:#(.+))?/.exec(
    src
  );
  if (!match) {
  }
  const site = (match[1] || match[2] || match[3] || "github").replace(
    /\.(com|org)$/,
    ""
  );
  if (!supported.has(site)) {
  }
  const user = match[4];
  const name = match[5].replace(/\.git$/, "");
  const subdir = match[6];
  const ref = match[7] || "HEAD";
  const domain = `${site}.${site === "bitbucket" ? "org" : site === "git.sr.ht" ? "" : "com"}`;
  const url = `https://${domain}/${user}/${name}`;
  const ssh = `git@${domain}:${user}/${name}`;
  const mode = supported.has(site) ? "tar" : "git";
  return { site, user, name, ref, url, ssh, subdir, mode };
}
//# sourceMappingURL=index.js.map
