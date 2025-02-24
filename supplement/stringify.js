/**说明
 * 函数和变量均使用小驼峰命名法
 * 数组中的 null、undefined 被剔除了
 * 对象中的 undefined 项 被剔除了
 * 循环引用的重复部分会以 |seen| 替代
 * 字符串、数组省略部分会标注长度
 */

// 获取数据类型
function getType(target) {
    if (Array.isArray(target))
        return 'array';
    else if (target && target.buffer)
        return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
    else if (target == null)
        return 'null';
    return typeof target;
}

// 处理字符串中特殊字符
function escapeSpecialCharacters(str) {
    return str
        .replace(/\\/g, "\\\\") // 转义反斜杠
        .replace(/\n/g, "\\n") // 转义换行符
        .replace(/\r/g, "\\r") // 转义回车符
        .replace(/\t/g, "\\t") // 转义制表符
        .replace(/\v/g, "\\v") // 转义垂直制表符
        .replace(/\f/g, "\\f") // 转义换页符
        .replace(/\u0008/g, "\\b"); // 转义退格符（使用 Unicode 表示）
}
// 字符串打印优化
function stringifyString(str, lengthLimit) {
    str = escapeSpecialCharacters(str);
    if (str.length <= lengthLimit)
        return `"${str}"`;
    const lengthSplit = Math.floor(lengthLimit * 0.75);
    const start = str.substring(0, lengthSplit);
    const end = str.substring(str.length - lengthLimit + lengthSplit);
    return `"${start}···${end}"|length ${str.length}|`;
}
// 判断一个数组是否全是数字
function isNumberArray(array) {
    return array.every(item => typeof item == 'number');
}
// 全数字数组打印优化
function shortedNumberArray(array, lengthLimit) {
    array = Array.from(array); // 针对字节数组
    if (array.length <= lengthLimit)
        return array.join(',');
    else {
        const lengthSplit = Math.floor(lengthLimit * 0.75);
        const start = array.slice(0, lengthSplit);
        const end = array.slice(lengthSplit - lengthLimit);
        const middle = '···';
        return [...start, middle, ...end].join(',');
    }
}
function cleanArray(array) {
    return array.filter(item => item != null && item != undefined);
}
// 将数组字符串化，并做一些打印优化
function stringifyArray(array, lengthLimit, isRemoveEmpty, seen) {
    // 使用 filter 方法去除空值
    if (isRemoveEmpty) {
        array = cleanArray(array);
    }
    if (isNumberArray(array)) {
        const res = shortedNumberArray(array, lengthLimit);
        if (array.length <= lengthLimit)
            return `[${res}]`;
        else
            return `[${res}]|length ${array.length}, type array|`;
    }
    else {
        let res = "[";
        for (let i of array) {
            let temp = stringify(i, lengthLimit, isRemoveEmpty, seen);
            res += temp;
            res += ",";
        }
        res = res.slice(0, -1) + ']';
        return res;
    }
}
// 将字节数组字符串化，并做一些打印优化
function stringifyArrayBuffer(arraybuffer, lengthLimit) {
    const res = shortedNumberArray(arraybuffer, lengthLimit);
    if (arraybuffer.length <= lengthLimit)
        return `[${res}]`;
    else
        return `[${res}]|length ${arraybuffer.length}, type arraybuffer|`;
}
function cleanObject(object) {
    let keys = Object.keys(object);
    let newObject = {};
    for (const key of keys) {
        if (object[key] == undefined || object[key] == null)
            continue;
        newObject[key] = object[key];
    }
    return newObject;
}
// 将对象字符串化，并做一些打印优化
function stringifyObject(object, lengthLimit, isRemoveEmpty, seen) {
    if (seen.has(object))
        return "|seen|";
    seen.add(object);
    if (isRemoveEmpty) {
        object = cleanObject(object);
    }
    let keys = Object.keys(object);
    if (keys.length == 0)
        return "{}";
    let res = "{";
    for (let key of keys) {
        res += key;
        res += ":";
        res += `"${stringify(object[key], lengthLimit, isRemoveEmpty, seen)}"`;
        res += ",";
    }
    res = res.slice(0, -1) + '}';
    return res;
}
// 检查是否是浏览器对象 window、document、navigator...
function isBrowserObject(variable) {
    let ret;
    if (variable && variable[Symbol.toStringTag]) {
        if (typeof variable != "symbol" && (0, getType)(variable) != 'arraybuffer') {
            ret = variable[Symbol.toStringTag].toLowerCase();
        }
    }
    return ret;
}
// 字符串化
function stringify(variable, lengthLimit = 50, isRemoveEmpty = true, seen = new WeakSet()) {
    let check = isBrowserObject(variable);
    if (check)
        return check;
    let type = (0, getType)(variable);
    switch (type) {
        case "string":
            return stringifyString(variable, lengthLimit);
        case "array":
            return stringifyArray(variable, lengthLimit, isRemoveEmpty, seen);
        case "arraybuffer":
            return stringifyArrayBuffer(variable, lengthLimit);
        case "object":
            return stringifyObject(variable, lengthLimit, isRemoveEmpty, seen);
        case "symbol":
            return variable.toString();
        case "function":
            return variable.name ? `function ${variable.name}` : `function anonymous`;
        default: // 'undefined', 'null', 'boolean', 'number'
            return "" + variable;
    }
}