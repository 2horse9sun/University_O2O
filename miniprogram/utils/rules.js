/**
 * 表单校验规则
 * 不符合规则时，返回false
 * 符合规则时，返回true
 */
 
const rules = {
    required(value){
        return (value == "") ? false : true
    },

    maxLength(value, size) {
        var size = size || 256;
        return String(value).length <= size ? true : false
    },

    onlyAlphabetic(value) {
        var reg = /^[0-9a-zA-Z]+$/;
        return reg.test(value) ? true : false
    },

    onlyAlphabeticUnderline(value) {
        var reg = /^[0-9a-zA-Z_]+$/;
        return reg.test(value) ? true : false
    },

    onlyNumber(value) {
        var reg = /^[0-9]+$/;
        return reg.test(value) ? true : false
    },

    onlyLetter(value) {
        var reg = /^[a-zA-Z]+$/;
        return reg.test(value) ? true : false
    },

    noSpecial(value) {
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        return regEn.test(value) || regCn.test(value) ? true : false
    },

    email(value) {
        var reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
        return reg.test(value) ? true : false
    },

    phone(value) {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return reg.test(value) ? true : false
    }
}
 

 
 
module.exports = rules