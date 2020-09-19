## Introduction

一个 `superagent` 插件，只提供了登录至华东师范大学公共数据库的功能。**纯本地化，零外来服务依赖。**

## Usage

### install

```bash
npm i superagent-ecnu-login
```


### Import

```ts
import superagent from 'superagent'
import { install } from 'superagent-ecnu-login'

const request = superagent.agent()

install(request) // inject the extension to superagent

```

### Calling

```ts

request.log2ECNU('<USERNAME>', '<PASSWORD>')
  .then(successful => {
    if (successful) { // 登录成功逻辑
      // continue your work after login

    } else { // 登陆失败逻辑
      // Have a retry!

    }
  })

```

## Implementation

1. 使用 `des.js` 做rsa加密
2. 使用 `tesseract.js` 做验证码识别

## Important Tips

1. 务必使用 `superagent 4`，更新的版本存在问题
2. 由于 `jest` 对 `tesseract.js` 的支持有异常，目前的 `test` 是假的
3. 因为 `tessdata` 在 `github` 上，下载太慢了。目前先放在了我OSS上