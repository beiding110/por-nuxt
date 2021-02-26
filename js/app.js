/**
* app.js
*存放常用方法及对象
*
* Date对象拓展
* pattern 日期格式化
* Format 日期格式化
*
* string对象拓展
* html 特殊字符转义及反转义
*
* owner对象
* validatorObj.mobile 手机格式验证
* validatorObj.arrayvalue 数组对象验证
* Chain 责任链类
* *link 责任链节点
* *run 责任链运行
* IsNullOrEmpty 验证非空
* inAttr 验证是否存在于标签属性
* enpty_obj 清空对象内容
* IsNumber 验证是否数字
* clone 对象深度复制
* arrBuildTree 数组拼树
* getSearch 获取window.location.search中某个key的值
* toSearch 将对象序列化成location.search格式
* getHash 获取window.location.hash中某个key的值
* setHash 将设定的键值置入window.location.hash中
* getLocal 获取localStorage里的数据
* setLocal 将值存入localStorage
* getSession 获取sessionStorage里的数据
* setSession 将值存入sessionStorage
* setRandomId 根据ref在dom结构上生成一个随机数id
* sortorder 格式化排序顺序关键字
* GetGuid 获取文件guid
* getObjByValue 根据值匹配数组中的对象
* timeToDate 切分日期为年月日
* getRandom 生成参数长度的随机数字符串
* floatToPercent 将小数转化为百分数
* wxPay 调起微信支付
* downloader 下载文件
* imgToBase64 图片转base64编码
* inheritPrototype 原型链继承
* getType 获取变量类型
* isMobile 是否手机端
*/
import Vue from 'vue'
import './MessageBox'
import storage from './storage'
import appNode from './app-node'

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (window.pa = factory(window));
}(this, (function (owner) {

    /**
    * 对Date的扩展，将 Date 转化为指定格式的String
    * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
    * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    * eg:
    * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
    * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
    * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
    * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
    使用：(eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"))).pattern("yyyy-M-d h:m:s.S");
    */
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    /**
    * 特殊字符转义及反转义
    * @param  {Boolean} encode 类型true为转义false为反转义
    * @return {string}        结果字符串
    */
    String.prototype.html = function (encode) {
        var replace = ["&#39;", "'",
            "&quot;", '"',
            "&nbsp;", " ",
            "&gt;", ">",
            "&lt;", "<",
            "&amp;", "&",
            "&yen;", "¥",
            "&lsquo;", "‘",
            "&rsquo;", "’",
            "&hellip;", "…",
            "&ldquo;", "“",
            "&rdquo;", "”",
            "&mdash;", "—"
        ];
        if (encode) {
            replace.reverse();
        }
        for (var i = 0, str = this; i < replace.length; i += 2) {
            str = str.replace(new RegExp(replace[i], 'g'), replace[i + 1]);
        }
        return str;
    };

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }


    appNode.mixin(storage, owner);
    appNode.mixin(appNode, owner);

    return owner;
})))
