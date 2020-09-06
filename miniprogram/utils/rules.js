/**
 * 表单校验规则
 * 不符合规则时，返回false
 * 符合规则时，返回true
 */
 
var rules = {}
 
// 是否必填
rules.required = function (value) {
    return (!!value || value === 0) ? true : false
};
 
// 最大字符长度
rules.maxLength = function (value, size) {
    var size = size || 256;
    return String(value).length <= size ? true : false
}
 
// 只允许字母和数字
rules.onlyAlphabetic = function (value) {
    var reg = /^[0-9a-zA-Z]+$/;
    return reg.test(value) ? true : false
}
 
// 只允许字母数字和下划线
rules.onlyAlphabeticUnderline = function (value) {
    var reg = /^[0-9a-zA-Z_]+$/;
    return reg.test(value) ? true : false
}
 
// 只允许数字
rules.onlyNumber = function (value) {
    var reg = /^[0-9]+$/;
    return reg.test(value) ? true : false
}
 
// 只允许字母
rules.onlyLetter = function (value) {
    var reg = /^[a-zA-Z]+$/;
    return reg.test(value) ? true : false
}
 
// 特殊字符
rules.noSpecial = function (value) {
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    return regEn.test(value) || regCn.test(value) ? true : false
}
 
// 邮箱
rules.email = function (value) {
    var reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    return reg.test(value) ? true : false
}
 
// 手机号（以1开头的11位数字）
rules.phone = function (value) {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return reg.test(value) ? true : false
}
 
// 只允许汉字
rules.chinese = function (value) {
    var reg = /^[\u4e00-\u9fa5]+$/;
    return reg.test(value) ? true : false
}
 
// 密码格式校验
rules.password = function (value) {
    if (String(value).length < 6) {
        return "密码长度不小于6位"
    }
    if (String(value).length > 18) {
        return "密码长度不超过18位"
    }
    var level = 0;
    if (value.search(/[a-z]/) > -1) {
        level++; //密码中包含小写字母
    }
    if (value.search(/[A-Z]/) > -1) {
        level++; //密码中包含大写字母
    }
    if (value.search(/[0-9]/) > -1) {
        level++; //密码中包含数组
    }
    if (value.search(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im) > -1) {
        level++; //密码中包含特殊符号
    }
    if(level<2){
        return "密码至少包含大写字母、小写字母、数字、标点符号中的两种"
    }else{
        return level; // 当前密码强度为level(2/3/4)
    }
}
 
 
module.exports = rules