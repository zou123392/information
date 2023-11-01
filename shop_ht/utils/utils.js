/**
 * @module 工具库 公共方法
 * @author : zou
 * */

// 导入crypto, 用于加密字符串, nodejs核心模块
let crypto = require("crypto");

// 导入jsonwebtoken, 用于登录验证
let jsonwebtoken = require("jsonwebtoken");

// 导入文件系统模块, nodejs核心模块
let fs = require("fs");

// 导入nodemailer, 用于发邮件
let nodemailer = require("nodemailer");

// 引入 支付宝 SDK
const AlipaySdk = require("alipay-sdk").default;

// 发邮件配置
// 创建发邮件实例
let transporter = nodemailer.createTransport({
  // 服务器地址
  host: config.emailOptions.host,

  // 端口, 25端口在阿里云服务器被禁止的, 建议使用465,
  port: config.emailOptions.port,

  // 如果端口为465,此项需要设置true, 其他端口需要修改为false
  secure: config.emailOptions.secure,

  // 授权认证
  auth: {
    // 用户邮箱地址
    user: config.emailOptions.user,

    // 授权码(不是邮箱登录密码)
    pass: config.emailOptions.pass,
  },
});

/**
 * @description 公共方法
 * @class Utils
 */
class Utils {
  /**
   * @description 加密字符串
   * @param {string} value 加密字符
   * @returns {string} md5.update(value).digest('hex') 以16进制输出，输出32个字符
   */
  encodeString(value) {
    // 将value切片
    value = value.slice(0, 3) + config.saltOptions.pwd + value.slice(3);

    // value: 被加密的字符串, string
    let md5 = crypto.createHash("md5");

    // 以16进制输出，输出32个字符
    return md5.update(value).digest("hex");
  }

  /**
   * @description 发邮件
   * @param {{ from: string, to: string, subject: string, [html,text] }} options 发邮件配置
   * options.from: 发件地址
   * options.to: 收件地址, 如果多个接收地址需要写成 'aaa@.126.com, bbb@126.com, ...'
   * options.subject: 邮件主题
   * text和html二选一
   * options.text: 发件内容(文本内容)
   * options.html: 发件内容(可含有HTML标签)
   */
  sendEmail(options) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: config.emailOptions.user,
          to: options.to,
          subject: options.subject,
          html: options.html,
        },
        (err, info) => {
          // 如果发邮件失败
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }

  /**
   * @description 随机生成验证码
   */
  randomCode() {
    let codes = [];
    for (let i = 0; i < 6; i++) {
      let code = Math.floor(Math.random() * 10);
      codes.push(code);
    }
    return codes.join("");
  }

  /**
   * @description token签名
   * @param {string} value 被签名的字符串
   */
  signToken(value) {
    // config.tokenOptions.salt: token加盐
    return jsonwebtoken.sign(
      {
        data: value,
      },
      config.tokenOptions.salt,
      {
        // 有效时间
        expiresIn: config.tokenOptions.expires,
      }
    );
  }

  /**
   * @description 解析token
   * @param {string} token
   */
  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, config.tokenOptions.salt, (err, info) => {
        // 如果验证失败
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }

  /**
   * @description 将cookie字符串转成对象
   * @param {string} cookie cookie字符串
   */
  transformCookie(cookie) {
    // 按照; 切割
    let cookieObj = {};
    let cookies = cookie.split("; ");
    cookies.map((v) => {
      let c = v.split("=");
      cookieObj[c[0]] = c[1];
    });

    return cookieObj;
  }

  /**
   * @description 上传图片
   * @param {string} base64 图片base64
   * @param {string} type 图片类型
   */
  uploadImg(base64, type) {
    return new Promise((resolve, reject) => {
      // 将base64转换buffer, 因为base64在传输到后台时, +号会被转换成空格, 所以需要将空格转换成+
      base64 = base64.replace(/ /g, "+");
      let buffer = Buffer.from(base64, "base64");

      // 生成文件名
      let filename = Math.random().toString().slice(2) + new Date().getTime() + "." + type;

      // 使用文件系统将Buffer写入服务器
      fs.writeFile(__basename + `${config.filePathOptions.imgPath}/` + filename, buffer, (err) => {
        // 上传文件失败
        if (err) {
          reject(err);
        } else {
          // 上传成功
          resolve(filename);
        }
      });
    });
  }

  /**
   * @description 支付宝沙箱
   */
  alipaySDK() {
    return new AlipaySdk({
      appId: "2021000122668604", // 开放平台上创建应用时生成的 appId
      signType: "RSA2", // 签名算法,默认 RSA2
      gateway: "https://openapi-sandbox.dl.alipaydev.com/gateway.do", // 支付宝网关地址 ，沙箱环境下使用时需要修改 正式线上的时候换成 https://openapi.alipay.com/gateway.do
      alipayPublicKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAniOuHcmPL9nXxcezcCzIZEHJwSsoWM4Wd5Nm6s4VAR5egTjTO1FtzI14akfEuSDaLEBCb8rx2fMWWL1QoZ0dRc8x9rt4PgFdblNhaE5d3fdSJqOXKYNqwjdDjgUbNTQf/KaAtc5hQCAi0uftrbOhezeYfArXF/syg68PBQjxzRPZ4BOMy5moEFMeij7JRJMYQDKavE/efokDGV3gSkgfgqgaBzfe0ve3ucmQ7M0nUZyoMK227LmJfYmlnfzzQ5XRPRCHyjpqqglYlkuSXJmD68hBJ8AxsTxvHKMWwGSptI/YkKHTTycIYt0I2BlbhgcPvYcWJZTUmNlzE83gatVbXQIDAQAB", // 支付宝公钥，需要对结果验签时候必填
      privateKey:
        "MIIEowIBAAKCAQEAniOuHcmPL9nXxcezcCzIZEHJwSsoWM4Wd5Nm6s4VAR5egTjTO1FtzI14akfEuSDaLEBCb8rx2fMWWL1QoZ0dRc8x9rt4PgFdblNhaE5d3fdSJqOXKYNqwjdDjgUbNTQf/KaAtc5hQCAi0uftrbOhezeYfArXF/syg68PBQjxzRPZ4BOMy5moEFMeij7JRJMYQDKavE/efokDGV3gSkgfgqgaBzfe0ve3ucmQ7M0nUZyoMK227LmJfYmlnfzzQ5XRPRCHyjpqqglYlkuSXJmD68hBJ8AxsTxvHKMWwGSptI/YkKHTTycIYt0I2BlbhgcPvYcWJZTUmNlzE83gatVbXQIDAQABAoIBAEbPr03DTYydvVLgw2a9htXt54vJ6X0qe0D8Dh+iPCGOGb8/VMbBBauMxZjBnkNPhKI/+//XHkj74svFqe9UTSFPUA4tkAAj2FRonbt5K+sSrgSDSFLcd9eTq3pSqwY92vzlCclfKojuWumZ1QHs56gnEu6oY/xnDQ2OO+mDQdMUFk249j+rAM1tHHpY2rzTepWICCckRna3NQRlPdp0svWAd9rzeCRS7G8/kSkUd0JSe4D1d3ZFhItfKUiak3TWIqBDfGjx3rmWjhdSxGp7fHYBthJ6ZGfSpXsFNTPE3gWdx6iJtKDM3Miw7zXDIlDzopLfIvwUZxTRlpB/0eLQ9YECgYEAyzzGwD+ATRvZnmGugSxR7C3H3VVhNNjAs3UlDpl0hGk5ssV4dJ4OTdBbtPXvqQW2xcCcbojy54VjyX8uUn2iHs1J7FP9Z3VT1Uozu5rR4DeXj5L9sXDcwG0iVHCNcRsyUavQgmCfC9WCebSUwuFgmj49ipVaVElqHTIsPxNOipECgYEAxzGsjGgT1oLO3qOEvVvglzSJtgd510fDbaLpQjETIrIddG8z/Hv20ugNAd77x0U8SJzCHzwKX1BhR1WTFLJCAP892gpg4u8DtpM3k8jP1NJWTwnpkxekrIZoxHd/RcRxmOnvZu2TeGUbH2bpqoaN966xfudYx3LUPKb4niBIMg0CgYEArViHRQ5khmBMuxQh3TdKIKHjqNrb8FE3+1jdZJhqk02U0vAvD3iIRsKCldR2t7mR7RWd14GjfOl+9Swu/Fj/4DnE5Xe12XpvKKsDeO5SOGXyNZlwHNpgzxfGgjMF0QUbZCGh1LJItbVEdj4Z7CaDWMvhfcRpqR59Da3vo1T6VqECgYAjGWGqK/yy48HIAVA2faYJfrx1UsPpZz/MZdRsUXFpv7Do/19Nsho/95uzJLOA3XZN5TFfh5jcSrGZfD66et6ehltDvGhuFGe3GCHG7K+SdK24p6p8vMHLlLOJSvUmOgM6Sp5gqKQ/prEsy1mJLsR9TE8CaYl/O4CiX1mXo2CVUQKBgB3n/53c1r/RBVXQ3Et0NfB6hVTaLLoKr6zifF2ly8r9g87GXOF/VBVedAEhvs4BhKx6YcQ5njnE+HF1AyZoqJJI5hKc+Zs3cpehZOqVqVJ5S09vamR7hyDdgTw0JnS5RjVH61feOCU1PuYSInT6fNO0wjItKVBdtReUQzI3O0HU", // 应用私钥字符串
    });

    //正式环境只要把上述换成正式的就可以了
  }
}

module.exports = new Utils();
