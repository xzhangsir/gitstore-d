# gitstore-d

提取 git 仓库的工具，支持 GitHub，Gitee。

## 安装

```nodejs
npm install gitstore-d
```

## API

```
gitD(store,options = {}).clone(destination)
```

将目标仓库 `store` clone 到指定文件夹 `destination`。

可以配置 `options` 参数 `{force:true}`，返回 Promise。200 即代表 success。

```
gitD(store).download()
```

下载目标仓库 `store` ，目前只支持 github

### store

```bash
user/repo#dev       # branch  默认主分支
user/repo#v1.2.3    # release tag
```

- GitHub —`github:账户名/仓库名`, 默认是`github`
- Gitee — `gitee:账户名/仓库名`

### options

```
{force:true}
```

会在每次克隆前，**删除 destination 中的所有文件**，克隆完成后，会删除 destination 下所有的`.git*`文件

### return

返回 Promise，**200**代表成功

## 示例

```javascript
gitD('gitee:user/store.git#v1.0', {
  force: true
})
  .clone('../xin')
  .then((res) => {
    console.log('res', res)
  })
```

```javascript
gitD('github:user/store.git#v1.0')
  .download()
  .then((res) => {
    console.log('res', res)
  })
```

## License

MIT
