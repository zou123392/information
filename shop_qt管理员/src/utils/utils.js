/**
 * @module 公共方法模块
 */
class Utils {
  /**
   * @description 格式化日期
   * @param {string} v 格式化时间
   * @param {string} format 格式化的格式
   * @returns 格式化时间
   */
  formatDate(v, format) {
    if (!v) return;
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
      s: date.getSeconds()
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

  // 获取当前时间
  getNow() {
    var d = new Date();
    var year = d.getFullYear();
    var month = change(d.getMonth() + 1);
    var day = change(d.getDate());
    var hour = change(d.getHours());
    var minute = change(d.getMinutes());
    // var second = change(d.getSeconds());

    function change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    }
    var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute// + ':' + second + '秒';
    return time;
  }

  // 水印
  watermark(settings, container) {
    //默认设置
    var defaultSettings = {
      // watermark_txt: "text",
      watermark_txt: settings['watermark_txt'],
      watermark_x: 20, //水印起始位置x轴坐标
      watermark_y: 20, //水印起始位置Y轴坐标
      watermark_rows: 5, //水印行数
      watermark_cols: 4, //水印列数
      watermark_x_space: 80, //水印x轴间隔
      watermark_y_space: 150, //水印y轴间隔
      watermark_color: '#cbcbcb', //水印字体颜色
      watermark_alpha: 0.4, //水印透明度
      watermark_fontsize: '15px', //水印字体大小
      watermark_font: '微软雅黑', //水印字体
      watermark_width: 255, //水印宽度
      watermark_height: 80, //水印长度
      watermark_angle: 20 //水印倾斜度数
    };

    var oTemp = document.createDocumentFragment();
    //获取页面最大宽度
    var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
    var cutWidth = page_width * 0.0150;
    var page_width = page_width - cutWidth;
    //获取页面最大高度
    var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 450;
    page_height = Math.max(page_height, window.innerHeight - 30);
    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
      defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
      defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
      defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
      defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
    }
    var x;
    var y;
    for (var i = 0; i < defaultSettings.watermark_rows; i++) {
      y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
      for (var j = 0; j < defaultSettings.watermark_cols; j++) {
        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
        var mask_div = document.createElement('div');
        mask_div.id = 'mask_div' + i + j;
        mask_div.className = 'mask_div';
        mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
        //设置水印div倾斜显示
        mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.visibility = "";
        mask_div.style.position = "absolute";
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = "hidden";
        mask_div.style.zIndex = "9999";
        //让水印不遮挡页面的点击事件
        mask_div.style.pointerEvents = 'none';
        mask_div.style.opacity = defaultSettings.watermark_alpha;
        mask_div.style.fontSize = defaultSettings.watermark_fontsize;
        mask_div.style.fontFamily = defaultSettings.watermark_font;
        mask_div.style.color = defaultSettings.watermark_color;
        mask_div.style.textAlign = "center";
        mask_div.style.width = defaultSettings.watermark_width + 'px';
        mask_div.style.height = defaultSettings.watermark_height + 'px';
        mask_div.style.display = "block";
        oTemp.appendChild(mask_div);
      };
    };
    container.appendChild(oTemp);
  }
}

export const utils = new Utils();
