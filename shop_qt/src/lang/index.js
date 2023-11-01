import Vue from "vue";
import VueI18n from "vue-i18n";
import zn from "./zn";
import en from "./en";
Vue.use(VueI18n); //全局注入

// 准备翻译的语言包环境变量
const i18n = new VueI18n({
  locale: "zn", //初始化中文
  messages: {
    zn: zn,
    en: en
  }
});

export default i18n;
