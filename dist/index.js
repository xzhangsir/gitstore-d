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
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_https = __toESM(require("https"));

// src/utils.js
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_child_process = __toESM(require("child_process"));
function mkdirp(dir) {
  const parent = import_path.default.dirname(dir);
  if (parent === dir)
    return;
  mkdirp(parent);
  try {
    import_fs.default.mkdirSync(dir);
  } catch (err) {
    if (err.code !== "EEXIST")
      throw err;
  }
}
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
async function fetchRefs(repo) {
  try {
    const { stdout } = await exec(`git ls-remote ${repo.url}`);
    return stdout.split("\n").filter(Boolean).map((row) => {
      const [hash, ref] = row.split("	");
      if (ref === "HEAD") {
        return {
          type: "HEAD",
          hash
        };
      }
      const match = /refs\/(\w+)\/(.+)/.exec(ref);
      return {
        type: match[1] === "heads" ? "branch" : match[1] === "refs" ? "ref" : match[1],
        name: match[2],
        hash
      };
    });
  } catch (error) {
    throw error;
  }
}

// src/index.js
module.exports = function gitD(src, opts) {
  return new GitD(src, opts);
};
var GitD = class {
  constructor(src, opts = {}) {
    this.src = src;
    this.force = opts.force || false;
    this.repo = normalize(src);
  }
  async clone(dest) {
    try {
      this._checkDirIsEmpty(dest);
      return await this._cloneWithGit(this.repo, dest);
    } catch (error) {
      throw error;
    }
  }
  async download() {
    try {
      return await this._cloneWithTar(this.repo);
    } catch (error) {
      throw error;
    }
  }
  async _checkDirIsEmpty(dir) {
    try {
      const files = import_fs2.default.readdirSync(dir);
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
  async _cloneWithGit(repo, dest) {
    let banch = repo.ref === "HEAD" ? "" : `-b ${repo.ref}`;
    await exec(`git clone ${banch} --depth 1 ${repo.url} ${dest}`);
    await exec(`rm -rf ${dest + "/.git*"}`);
    return 200;
  }
  async _cloneWithTar(repo) {
    const hash = await this._getHash(repo);
    const file = `${repo.type}/${hash}.tar.gz`;
    const url = repo.type === "gitee" ? `${repo.url}/repository/archive/${hash}.tar.gz` : `${repo.url}/archive/${hash}.tar.gz`;
    try {
      import_fs2.default.statSync(file);
      return 240;
    } catch (error) {
      mkdirp(import_path2.default.dirname(file));
      await fetch(url, file);
      return 200;
    }
  }
  async _getHash(repo) {
    try {
      const refs = await fetchRefs(repo);
      if (repo.ref === "HEAD") {
        return refs.find((ref) => ref.type === "HEAD").hash;
      }
      return this._selectRef(refs, repo.ref);
    } catch (err) {
      throw err;
    }
  }
  _selectRef(refs, selector) {
    for (const ref of refs) {
      if (ref.name === selector) {
        return ref.hash;
      }
    }
    if (selector.length < 8)
      return null;
    for (const ref of refs) {
      if (ref.hash.startsWith(selector))
        return ref.hash;
    }
  }
};
function normalize(store) {
  let regex = /^(?:(github|gitee):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
  let match = regex.exec(store);
  let type = (match[1] || "github").replace(/\.(com|org)$/, "");
  let domain = match[2] || null;
  let user = match[3];
  let name = match[4].replace(".git", "");
  let ref = match[5] || "HEAD";
  if (domain === null) {
    domain = `${type}.com`;
  }
  let url = `https://${domain}/${user}/${name}`;
  return { type, domain, user, name, ref, url };
}
function fetch(url, dest) {
  return new Promise((resolve, reject) => {
    let options = url;
    import_https.default.get(options, (response) => {
      const code = response.statusCode;
      if (code >= 400) {
        reject({ code, message: response.statusMessage });
      } else if (code >= 300) {
        fetch(response.headers.location, dest).then(resolve, reject);
      } else {
        response.pipe(import_fs2.default.createWriteStream(dest)).on("finish", () => resolve()).on("error", reject);
      }
    }).on("error", reject);
  });
}
