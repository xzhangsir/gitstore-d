# gitstore-d

使用node提取git仓库的下载工具，支持 GitHub，Gitee，GitLab，Bitbucket。

## 安装

```nodejs
npm install gitstore-d
```

## API

### gitdownload(store, destination, options= {})

将目标仓库 `store` 下载到指定文件夹 `destination`。

可以配置 `options` 参数，返回Promise。200即代表success。

### store

仓库地址简写字符串(当然你也可以直接使用仓库地址，后面会有提到)：

- GitHub —`github:账户名/仓库名`, 默认是`github`，故而可以简写为  `账户名/仓库名` 
- Gitee —  `gitee:账户名/仓库名`
- GitLab — `gitlab:账户名/仓库名`
- Bitbucket — `bitbucket:账户名/仓库名`

`store` 参数默认使用 `master` 主分支，你也可以这样指定分支 `账户名/仓库名#分支名`。

为了指定下类型，你可以指定一个自定义来源：`gitlab:xxx.com:账户名/仓库名`。

除非指定了协议, 否则自定义来源将分别默认为 `https` 或 `git @`

##### direct

使用 direct 将绕过  仓库地址简写字符串  解释器，直接使用 `url` 地址。

如果在非克隆`{clone:false}`的情况下使用 `direct`， 则必使用完整 zip 文件 url ，如果需要，请指定包括分支的完整路径。

如果在克隆`{clone:true}`的情况下使用 `direct`，你必须指定 git 仓库的完整地址，可以用 URL 片段指定分支，格式形如: `direct:url#分支名`

### destination

git下载的文件，保存的目标位置。

### options

可选参数对象，目前只接受`clone`{Boolean}默认值`false` ， true 表示使用 `git clone` 替代 http 下载。

##### clone 

`true`  会在每次克隆前，**删除destination中的所有文件**，克隆完成后，会删除destination下所有的`.git*`文件

### return

返回Promise，**200**代表成功

## 示例

### 仓库地址简写字符串

使用 http 方式从 Github 仓库的main 分支下载。

```javascript
gitdownload("zhangxin1001/xinui-vue#main","test/del").then(res=>{
	console.log(res) //200: success
})
```

使用 git clone 方式从 Gitee 仓库的 master 分支下载。

```javascript
gitdownload("gitee:用户名/仓库名","test/del",{clone:true}).then(res=>{
	console.log(res)
})
```

使用 git clone 方式从 Bitbucket 仓库的 my-branch 分支下载。

```javascript
gitdownload('bitbucket:用户名/仓库名#my-branch', 'test/del', { clone: true }).then(res=>{
	console.log(res)
})
```

使用 http  方式从 GitLab 仓库的 my-branch 分支下载。

```javascript
gitdownload('gitlab:xxxxgitlab.com:用户名/仓库名#my-branch', 'test/del').then(res=>{
	console.log(res)
})
```

### 直接使用 url（Direct）

直接使用 url 通过 http 下载。

```javascript
gitdownload('direct:http://git.xxxx.com:8181/xxxxx.git', 'test/del', { clone: true }).then(res=>{
	console.log(res)
})
```

## License

MIT

## 声明

本库基于 [download-git-repo](git://github.com/flipxfx/download-git-repo)  3.0.2 版本扩展开发。

download-git-repo 库，虽功能完善，但其**不支持Gitee**（天朝的工具，必须支持），**未返回Promise**(采用的是callback的方式)。

故此对其做了enhancement。























