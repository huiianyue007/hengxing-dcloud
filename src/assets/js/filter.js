import common from 'assets/js/common.js'
import AttributedLabel from 'assets/js/attributedLabel.js'
import _ from 'underscore'

/**
 * html提取字符串过滤器，将html中的标签全部去除，仅保留文字，
 * @param {String} length 返回字符串的截取长度，不传值不做截取处理
 * @return {String} 返回处理的纯文字字符串
 */
export const strip = (html,length) => {
  return length ? common.strip(html).substr(0,length) : common.strip(html)
}

/**
 * 从设置好的AttributedLabel中获取响应的显示文字
 * @param {String} type 显示内容类别如：order.status
 * @param {String} defaultValue 没有对应内容时显示的文字
 * @return {String} 搜索到的显示文字
 */
export const show = (val,type,defaultValue) => {
  let attributes = common.searchObj(AttributedLabel,type)
  if(_.isObject(attributes)){
    let rt = attributes[val]
    if(rt){
      return rt
    }
  }
  if(defaultValue){
    return defaultValue
  }else{
    return '未设置'
  }
}

/**
 * 性别显示过滤器
 */
export const sex = (val) => {
  return AttributedLabel.sex[val]
}