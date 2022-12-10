var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => gitD
});
module.exports = __toCommonJS(src_exports);
var import_fs = __toESM(require("fs"));
function gitD(src, opts) {
  return new GitD(src, opts);
}
var GitD = class {
  constructor(src, opts) {
    this.src = src;
  }
  clone(dir) {
    console.log(dir);
    this._checkDirIsEmpty(dir);
  }
  _checkDirIsEmpty(dir) {
    console.log(dir);
    import_fs.default.readdir(dir, function(err, files) {
      console.log(files);
    });
    return;
    try {
      console.log(dir);
      const files = import_fs.default.readdirSync(dir);
      console.log(files);
      return;
      if (files.length > 0) {
        if (this.force) {
          this._info({
            code: "DEST_NOT_EMPTY",
            message: `destination directory is not empty. Using options.force, continuing`
          });
        } else {
          throw new DegitError(
            `destination directory is not empty, aborting. Use options.force to override`,
            {
              code: "DEST_NOT_EMPTY"
            }
          );
        }
      } else {
        this._verbose({
          code: "DEST_IS_EMPTY",
          message: `destination directory is empty`
        });
      }
    } catch (err) {
      if (err.code !== "ENOENT")
        throw err;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
