import { Date } from "core-js";

/**
 * @module 公共方法模块
 */
class Utils {
  /**
   * @description 格式化日期1
   * @param {string} v 格式化时间
   * @param {string} format 格式化的格式
   * @returns 格式化时间
   */
  formatDate(v, format) {
    let date = new Date(v);

    // 格式化年份
    let year = date.getFullYear().toString();
    if (/(y+)/.test(format)) {
      // 获取匹配组内容
      let content = RegExp.$1;
      format = format.replace(
        content,
        year.slice(year.length - content.length)
      );
    }

    // 格式化月份, 日份 ,时 ,分 ,秒
    let obj = {
      M: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
    };

    for (let key in obj) {
      // 创建动态正则
      let reg = new RegExp(`(${key}+)`);
      if (reg.test(format)) {
        let group = RegExp.$1;
        format = format.replace(
          group,
          obj[key] >= 10
            ? obj[key]
            : group.length == 2
              ? "0" + obj[key]
              : obj[key]
        );
      }
    }
    return format;
  }

  /**
   * @description 格式化日期2
   * @param {string}time 格式化时间
   * @param {string} option 格式化的格式
   * @returns 格式化时间
   */
  formatTime(time, option) {
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;
    let ymd = d.getFullYear() + "-" + d.getMonth() + 1 + "-" + d.getDate();

    if (diff < 59) {
      return "刚刚";
    } else if (diff < 3600) {
      return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
      return "1天前";
    } else {
      return ymd;
    }
  }

  /**
   * @description 格式化日期
   * @param {string}time 格式化时间
   * @param {string} option 格式化的格式
   * @returns 格式化时间
   */
  formatMessageTime(time) {
    const d = new Date(time);
    const now = Date.now();

    const timeDay = d.getDate()
    const nowDay = new Date(now).getDate()
    const diff = (now - d) / 1000;

    // 处理时间
    let minutes = ''
    let seconds = ''
    d.getMinutes().toString().length === 1 ? minutes = '0' + d.getMinutes() : minutes = d.getMinutes()
    d.getSeconds().toString().length === 1 ? seconds = '0' + d.getSeconds() : seconds = d.getSeconds()

    let ymd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.getHours() + ':' + minutes;

    if (nowDay - timeDay === 0) { //当天
      if (diff < 59) {
        return "刚刚";
      } else if (diff < 3600) {
        return Math.ceil(diff / 60) + "分钟前";
      } else {
        return d.getHours() + ':' + minutes + ':' + seconds
      }
    } else {
      if (diff < 3600 * 24) {
        return '昨天 ' + d.getHours() + ':' + minutes + ':' + seconds
      }
      if (diff > 3600 * 24 && diff < 3600 * 24 * 2) {
        return "1天前";
      } else {
        return ymd;
      }
    }
  }

  /**
   * @description 格式化金额
   * @param {string}price 价格
   * @param {Number}num 保留位数
   */
  formatPrice(price, num) {
    // 还可以加参数，进行更优雅的做法
    // const options = {
    //   style: "currency",
    //   currency: "cyn",
    // };
    // toLocaleString("zh-CN", options)
    // return Number(Number(price).toLocaleString()).toFixed(num);
    return Number(Number(price).toFixed(num)).toLocaleString();
  }

  /**
   * @description 获取浏览器url参数 并解码
   * @param url String
   * @return Object
   */

  getQueryString(url) {
    //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
      let str = url.substr(1);
      let strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        //就是这句的问题
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(
          strs[i].split("=")[1]
        );
      }
    }

    return theRequest;
  }

  /**
   * @description 数据加密与解密
   * @param str String
   */
  Base64 = {
    //加密
    encode(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }
        )
      );
    },
    //解密
    decode(str) {
      // Going backwards: from bytestream, to percent-encoding, to original string.
      return decodeURIComponent(
        atob(str)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    },
  };

  /**
   * @description 订单超时判断
   * @params 创建时间 time  订单时效 number
   * @return 未超时 false 超时 true
   */
  timeOut(createTime, diffHour) {
    // 当前日期
    let nowDate = new Date();
    nowDate = nowDate.getTime();

    // 创建日期
    let createDate = new Date(createTime);
    createDate = createDate.getTime();

    // 差距
    let diff = createDate + diffHour * 60 * 60 * 1000 - nowDate;

    if (diff <= 0) {
      clearInterval(this.timer);
      return true;
    }
    return false;
  }

  /**
   * @description 会话消息事件处理
   * @params 最新消息数组 oldArr    时间间隔 默认5分钟 diff
   * @return 未超时 false 超时 true
   */
  showDiffTime(oldArr, diff = 5 * 60 * 1000) {
    if (oldArr.length === 0) return

    oldArr.forEach((item, index, self) => {
      console.log(index);
      index === 0 ? item.showTime = true : ''

      if (index > 0) {
        let diffTime = new Date(item.createdAt) - new Date(self[index - 1].createdAt)
        console.log(diffTime);
        diffTime > diff ? item.showTime = true : ''
      }
    })
    return oldArr
  }
}

export const utils = new Utils();
