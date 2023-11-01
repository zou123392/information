## 1、环境依赖

```
- Node.js：推荐使用 14.x 以上 LTS 版本
```

## 2、确保自己电脑装有 node 的环境

```
可以用 node -v 查看，
如果有版本号输出则说明环境支持
```

## 3、config 文件夹 服务端配置

```
  > 服务器配置
  > 随机昵称
  > 加盐配置, 用于加强加密
  > 数据库配置 --- 必须配置
    >> database: 'server_db', // 自己的数据库名称
    >> username: 'root', // 数据库用户名
    >> password: 'root', // 数据库登录密码
  > 邮件配置, 验证码
  > 允许请求(白名单)
  > 验证验证码请求路径
  > token 配置
```

## 4、项目构建

```
npm install 或 yarn
```

## 5、项目运行

```
node index.js 或 yarn server
```
