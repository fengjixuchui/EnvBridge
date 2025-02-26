let nothing = {"is_proxy":false,"is_hook_proxyhandler":false,"is_print":true,"history":"","memory":{}};
;(function (__obj)
{
// file path: E:\ning\code\Reverse\WEB\EnvBridge\supplement\toStringNative.js
// 新的 toString
function newToString() 
{
    if (typeof this == 'function' && this[symbol])
        return this[symbol];
    else
        return toString.call(this);
}
// 精简版设置属性
function setProperty(func, key, value) 
{
    Object.defineProperty(func, key, {
        "enumerable": false,
        "configurable": true,
        "writable": true,
        "value": value
    });
}

function toStringNative(func, funcName)
{
    setProperty(func, symbol, `function ${funcName}() { [native code] }`);
}

let toString = Function.toString;
delete Function.prototype['toString'];

const symbol = Symbol((Math.round(Math.random() * 10 ** (Math.random() * 10 + 1))).toString(36));

setProperty(Function.prototype, "toString", newToString);
toStringNative(Function.prototype.toString, "toString");


__obj.toStringNative = toStringNative;

})(nothing);
;(function (__obj)
{
// file path: E:\ning\code\Reverse\WEB\EnvBridge\supplement\stringify.js
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

__obj.stringify = stringify;

})(nothing);
;(function (__obj)
{
// file path: E:\ning\code\Reverse\WEB\EnvBridge\supplement\envProxy.js
// 创建一个代理对象，用于拦截并处理对象的属性访问。
function proxy(proxyObject, name, callBackFunc) 
{
    // 句柄
    let handler = {
        getPrototypeOf(target) {
            /* 捕获
            Object.getPrototypeOf()
            Object.prototype.__proto__
            Object.prototype.isPrototypeOf()
            instanceof
            */
            return _proxyHandleTemplate(name, 'getPrototypeOf', target, undefined, [target], callBackFunc);
        },
        setPrototypeOf(target, prototype) {
            /* 捕获
            Object.setPrototypeOf()
            */
            return _proxyHandleTemplate(name, 'setPrototypeOf', target, undefined, [target, prototype], callBackFunc);
        },
        isExtensible(target) {
            /* 捕获
            Object.isExtensible()
            */
            return _proxyHandleTemplate(name, 'isExtensible', target, undefined, [target], callBackFunc);
        },
        preventExtensions(target) {
            /* 捕获
            Object.preventExtensions()
            */
            return _proxyHandleTemplate(name, 'preventExtensions', target, undefined, [target], callBackFunc);
        },
        getOwnPropertyDescriptor(target, property) {
            /* 捕获
            Object.getOwnPropertyDescriptor()
            */
            return _proxyHandleTemplate(name, 'getOwnPropertyDescriptor', target, property, [target, property], callBackFunc);
        },
        defineProperty(target, property, descriptor) {
            /* 捕获
            Object.defineProperty()
            */
            return _proxyHandleTemplate(name, 'defineProperty', target, property, [target, property, descriptor], callBackFunc);
        },
        has(target, property) {
            /* 捕获
            属性查询：foo in proxy
            继承属性查询：foo in Object.create(proxy)
            with 检查: with(proxy) { (foo); }
            */
            return _proxyHandleTemplate(name, 'has', target, property, [target, property], callBackFunc);
        },
        get(target, property, receiver) {
            /* 捕获
            访问属性：proxy[foo] 和 proxy.bar
            访问原型链上的属性：Object.create(proxy)[foo]
            */
            return _proxyHandleTemplate(name, 'get', target, property, [target, property, receiver], callBackFunc);
        },
        set(target, property, value, receiver) {
            /* 捕获
            指定属性值：proxy[foo] = bar 和 proxy.foo = bar
            指定继承者的属性值：Object.create(proxy)[foo] = bar
            */
            return _proxyHandleTemplate(name, 'set', target, property, [target, property, value, receiver], callBackFunc);
        },
        deleteProperty(target, property) {
            /* 捕获
            删除属性：delete proxy[foo] 和 delete proxy.foo
            */
            return _proxyHandleTemplate(name, 'deleteProperty', target, property, [target, property], callBackFunc);
        },
        ownKeys(target) {
            /* 捕获
            Object.getOwnPropertyNames()
            Object.getOwnPropertySymbols()
            Object.keys()
            */
            return _proxyHandleTemplate(name, 'ownKeys', target, undefined, [target], callBackFunc);
        },
        apply(target, thisArg, argumentsList) {
            /* 捕获
            proxy(...args)
            Function.prototype.apply() 和 Function.prototype.call()
            Object.keys()
            */
            return _proxyHandleTemplate(name, 'apply', target, undefined, [target, thisArg, argumentsList], callBackFunc);
        },
        construct(target, argumentsList, newTarget) {
            /* 捕获
            new proxy(...args)
            */
            return _proxyHandleTemplate(name, 'construct', target, undefined, [target, argumentsList, newTarget], callBackFunc);
        },
    };
    return new Proxy(proxyObject, handler);
}
/**
 * 代理中的模板
 * @param {string} name
 * @param {string} mode
 * @param {object} target
 * @param {string} property
 * @param {Array} args
 * @param {Function | *} callBackFunc
 * @returns
 */
function _proxyHandleTemplate(name, mode, target, property, args, callBackFunc) {
    let result;
    let value;
    switch (mode) {
        case "getPrototypeOf":
            result = Reflect.getPrototypeOf(args[0]);
            value = result;
            break;
        case "setPrototypeOf":
            result = Reflect.setPrototypeOf(args[0], args[1]);
            value = args[1];
            break;
        case "isExtensible":
            result = Reflect.isExtensible(args[0]);
            value = result;
            break;
        case "preventExtensions":
            result = Reflect.preventExtensions(args[0]);
            value = result;
            break;
        case "getOwnPropertyDescriptor":
            result = Reflect.getOwnPropertyDescriptor(args[0], args[2]);
            value = result;
            break;
        case "defineProperty":
            result = Reflect.defineProperty(args[0], args[1], args[2]);
            value = args[2];
            break;
        case "has":
            result = Reflect.has(args[0], args[1]);
            value = result;
            break;
        case "get":
            result = Reflect.get(args[0], args[1]);
            value = result;
            break;
        case "set":
            result = Reflect.set(args[0], args[1], args[2]);
            value = args[2];
            break;
        case "deleteProperty":
            result = Reflect.deleteProperty(args[0], args[1]);
            value = result;
            break;
        case "ownKeys":
            result = Reflect.ownKeys(args[0]);
            value = result;
            break;
        case "apply":
            result = Reflect.apply(args[0], args[1], args[2]);
            value = result;
            break;
        case "construct":
            result = Reflect.construct(args[0], args[1]);
            value = result;
            break;
    }
    // 回调函数，扩展代理功能
    if (callBackFunc instanceof Function) {
        try {
            callBackFunc(name, mode, target, property, value);
        }
        catch (error) {
            throw error;
        }
    }
    return result;
}

function envProxy(proxyObject, name)
{
    let callBackFunc = (name, mode, target, property, value) => { 
        if (!__obj["is_hook_proxyhandler"]) return;
        // let watches = ["get", "set", "has"];
        // if (!watches.includes(mode)) return;

        __obj["is_hook_proxyhandler"] = false;
        let value_ = __obj["stringify"](value, 20, false);
        let property_ =  __obj["stringify"](property, 20, false);
        let text = `[${name}] ${mode} property: ${property_} value: ${value_}\r\n`;
        __obj["is_hook_proxyhandler"] = true;

        __obj["history"] += text;
        if (__obj["is_print"]) console.log(text);
    }

    return proxy(proxyObject, name, callBackFunc);
}

__obj.envProxy = envProxy;

})(nothing);
;(function (__obj)
{
// file path: E:\ning\code\Reverse\WEB\EnvBridge\supplement\addLog.js
function addLog(text)
{
    __obj["history"] += text;
    __obj["history"] += "\n";
    if (__obj["is_print"]) console.log(text);
}

__obj.addLog = addLog;

})(nothing);
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\document.js
function HTMLDocument() 
{ 
    nothing.addLog("HTMLDocument 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function Node() 
{ 
    nothing.addLog("Node 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function Document() {};

var document = {};
document.__proto__ = HTMLDocument.prototype;
HTMLDocument.prototype.__proto__ = Document.prototype;
Document.prototype.__proto__ = Node.prototype;
Node.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(HTMLDocument.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDocument",
        configurable: true
    }
});
Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: "Node",
        configurable: true
    }
});
Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true
    }
});
nothing.toStringNative(Document, "Document");
nothing.toStringNative(Node, "Node");
nothing.toStringNative(HTMLDocument, "HTMLDocument");

// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\EventTarget.js
function EventTarget() {};

Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true
    }
})
nothing.toStringNative(EventTarget, "EventTarget");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\history.js
function History() 
{ 
    nothing.addLog("History 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var history = {};
history.__proto__ = History.prototype;

Object.defineProperties(History.prototype, {
    [Symbol.toStringTag]: {
        value: "History",
        configurable: true
    }
});
nothing.toStringNative(History, "History");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\localStorage.js
function Storage() 
{ 
    nothing.addLog("Storage 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var localStorage = {};
localStorage.__proto__ = Storage.prototype;

Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true
    }
});
nothing.toStringNative(Storage, "Storage");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\location.js
function Location()
{
    nothing.addLog("Location 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var location = {};
location.__proto__ = Location.prototype;

Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: "Location",
        configurable: true
    }
});
nothing.toStringNative(Location, "Location");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\navigation.js
function Navigation() 
{ 
    nothing.addLog("Navigation 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var navigation = {};
navigation.__proto__ = Navigation.prototype;
Navigation.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(Navigation.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigation",
        configurable: true
    }
});
nothing.toStringNative(Navigation, "Navigation");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\navigator.js
function Navigator() 
{ 
    nothing.addLog("Navigator 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

// 不能用 let
var navigator = {};
navigator.__proto__ = Navigator.prototype;

Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true
    }
});
nothing.toStringNative(Navigator, "Navigator");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\plugin.js
function Plugin() 
{ 
    nothing.addLog("Plugin 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function PluginArray() 
{ 
    nothing.addLog("PluginArray 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function MimeType() 
{ 
    nothing.addLog("MimeType 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function MimeTypeArray() 
{ 
    nothing.addLog("MimeTypeArray 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

navigator.plugins = {};
navigator.mimeTypes = {};
navigator.plugins.__proto__ = PluginArray.prototype;
navigator.mimeTypes.__proto__ = MimeTypeArray.prototype;

Object.defineProperties(Plugin.prototype, {
    [Symbol.toStringTag]: {
        value: "Plugin",
        configurable: true
    }
});
Object.defineProperties(MimeType.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeType",
        configurable: true
    },
});
Object.defineProperties(PluginArray.prototype, {
    [Symbol.toStringTag]: {
        value: "PluginArray",
        configurable: true
    }
});
Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray",
        configurable: true
    }
});
nothing.toStringNative(Plugin, "Plugin");
nothing.toStringNative(MimeType, "MimeType");
nothing.toStringNative(PluginArray, "PluginArray");
nothing.toStringNative(MimeTypeArray, "MimeTypeArray");

// 补充方法（无法像 envProxy, toStringNative... 这些函数那样，写在文件的最开头）。

// 检查是否是某个对象的实例
nothing.isInstanceOf = (obj, constructor) => {
    return obj.__proto__ == constructor.prototype;
}
// 创建一个 MIME 类型对象
nothing.newMimeType = (data) => {
    if (!nothing.isInstanceOf(data.plugin, Plugin)) throw new Error("data.plugin 需要是 Plugin 的实例.");
    
    let mime_type = {};
    mime_type.__proto__ = MimeType.prototype;
    mime_type.description = data.description;
    mime_type.suffixes = data.suffixes;
    mime_type.type = data.type;
    // plugin 是 nothing.newPlugin 出来的 
    mime_type.enabledPlugin = data.plugin;

    return mime_type;
}
// 创建一个插件对象
nothing.newPlugin = (data) => {
    let plugin = {};
    plugin.__proto__ = Plugin.prototype;
    plugin.description = data.description;
    plugin.filename = data.filename
    plugin.name = data.name;

    // 不检查可以不传 data.mime_types
    if (data.mime_types)
    {
        // 做一个检查
        if (!Array.isArray(data.mime_types)) throw new Error("需要以数组的形式传入 mime_types.");

        plugin.length = data.mime_types.length;
        for (let i = 0; i < data.mime_types.length; i++)
        {
            let mime_type_data = {
                "description": data.mime_types[i].description,
                "suffixes": data.mime_types[i].suffixes,
                "type": data.mime_types[i].type,
                "plugin": plugin
            };
            let mime_type = nothing.newMimeType(mime_type_data);

            plugin[i] = mime_type;
            Object.defineProperty(plugin, mime_type.type, {
                value: mime_type,
                writable: true
            });
        }
    }

    return plugin;
}
// 为 navigator.plugins 添加
nothing.insert_plugins = (plugin) => {
    // 做一个检查
    if (!nothing.isInstanceOf(plugin, Plugin)) throw new Error("plugin 需要是 Plugin 的实例.");

    if (navigator.plugins.length == undefined)
    {
        navigator.plugins.length = 1;
        navigator.plugins[0] = plugin;
        navigator.plugins[plugin.name] = plugin;
    }
    else
    {
        // 考虑了重复插入的情况
        if (navigator.plugins[plugin.name] == undefined)
        {
            navigator.plugins[navigator.plugins.length] = plugin;
            navigator.plugins[plugin.name] = plugin;
            navigator.plugins.length++;
        }
        else 
        {
            // 重复插入就替换
            navigator.plugins[plugin.name] = plugin;
            for (let i = 0; i < navigator.plugins.length; ++i)
            {
                if (navigator.plugins[i].name == plugin.name)
                {
                    navigator.plugins[i] = plugin;
                    break;
                }
            }
        }
    }
}
// 为 navigator.mimeTypes 添加
nothing.insert_mime_types = (mime_type) => {
    // 做一个检查
    if (!nothing.isInstanceOf(mime_type, MimeType)) throw new Error("mime_type 需要是 MimeType 的实例.");

    if (navigator.mimeTypes.length == undefined)
    {
        navigator.mimeTypes.length = 1;
        navigator.mimeTypes[0] = mime_type;
        navigator.mimeTypes[mime_type.type] = mime_type;
    }
    else
    {
        // 考虑了重复插入的情况
        if (navigator.mimeTypes[mime_type.type] == undefined)
        {
            navigator.mimeTypes[navigator.mimeTypes.length] = mime_type;
            navigator.mimeTypes[mime_type.type] = mime_type;
            navigator.mimeTypes.length++;
        }
        else 
        {
            // 重复插入就替换
            navigator.mimeTypes[mime_type.type] = mime_type;
            for (let i = 0; i < navigator.mimeTypes.length; ++i)
            {
                if (navigator.mimeTypes[i].type == mime_type.type)
                {
                    navigator.mimeTypes[i] = mime_type;
                    break;
                }
            }
        }
    }
}
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\screen.js
function Screen() 
{ 
    nothing.addLog("Screen 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var screen = {};
screen.__proto__ = Screen.prototype;
Screen.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true
    }
});
nothing.toStringNative(Screen, "Screen");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\baseEnv\window.js
let window = globalThis;

function Window() 
{
    nothing.addLog("Window 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function WindowProperties() {};

window.__proto__ = Window.prototype;
Window.prototype.__proto__ = WindowProperties.prototype;
WindowProperties.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true
    }
});
Object.defineProperties(WindowProperties.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowProperties",
        configurable: true
    }
});
nothing.toStringNative(Window, "Window");
// file path: E:\ning\code\Reverse\WEB\EnvBridge\supplement\extras.js
delete global;

WindowProperties = undefined;

// 统一代理
nothing.init_proxy_object_1 = [
    "window", "navigator", "localStorage", "screen", "history", "location", "document", "navigation", "navigator.plugins", 
    "navigator.mimeTypes",
];
nothing.init_proxy_object_2 = [
    "EventTarget", "Window", "Navigator", "Storage", "Screen", "History", "Location", "HTMLDocument", "Node", "Document",
    "Navigation", "Plugin", "PluginArray", "MimeType", "MimeTypeArray",
];

if (nothing.is_proxy)
{
    for (let obj of [...nothing.init_proxy_object_1, ...nothing.init_proxy_object_2])
    {
        eval(`${obj} = nothing.envProxy(${obj}, "${obj}");`)
    }
}

// 要写在代理后
window.window = window;
window.self = window;
// file path: E:\ning\code\Reverse\WEB\EnvBridge\supplement\divEnv.js
// 收集了几个 plugins mimeTypes 的信息，可以照着写（这里只是添加信息，还需要 new 出来，应该会写个脚本，取浏览器自动获取）。
nothing.memory.plugins = [
    {
        description: "Portable Document Format",
        filename: "internal-pdf-viewer",
        name: "PDF Viewer",
    },
    {
        description: "Portable Document Format",
        filename: "internal-pdf-viewer",
        name: "Chrome PDF Viewer",
    },
    {
        description: "Portable Document Format",
        filename: "internal-pdf-viewer",
        name: "Chromium PDF Viewer",
    },
]
nothing.memory.mime_types = [
    {
        description: "Portable Document Format",
        suffixes: "pdf",
        type: "application/pdf",
    },
    {
        description: "Portable Document Format",
        suffixes: "pdf",
        type: "text/pdf",
    },
]
// navigator.plugins
for (let i = 0; i < nothing.memory.plugins.length; i++)
{
    let tmp = nothing.memory.plugins[i];
    // 注意并不是所有的 nothing.memory.mime_types 都要赋值上，一般是选一个或几个
    tmp.mime_types = nothing.memory.mime_types;
    nothing.insert_plugins(nothing.newPlugin(tmp));
}
// navigator.mimeTypes
for (let i = 0; i < nothing.memory.mime_types.length; i++)
{
    let tmp = nothing.memory.mime_types[i];
    // 某一个 plugin
    tmp.plugin = navigator.plugins[0];
    nothing.insert_mime_types(nothing.newMimeType(tmp));
}


// 最后再开启 hook
debugger;
nothing.is_hook_proxyhandler = true;

// file path: E:\ning\code\Reverse\WEB\EnvBridge\examples\test.js
function test(str, )
{
    let result = eval(str);
    if (result == true)
    {
        console.log(`[test] ${str}......success.`);
    }
    else 
    {
        console.error(`[test] ${str}......failed.`);
    }
}

test("window.window == window");
test("this == window");

test("window.toString() == '[object Window]'");
test("Window.toString() == 'function Window() { [native code] }'");
test("document.toString() == '[object HTMLDocument]'");

test("navigator.plugins.toString() == '[object PluginArray]'");
test("navigator.mimeTypes.toString() == '[object MimeTypeArray]'");
test("navigator.plugins[0].toString() == '[object Plugin]'");
test("navigator.mimeTypes[0].toString() == '[object MimeType]'");

test("navigator.mimeTypes[0].enabledPlugin[0] != navigator.mimeTypes[0]");
test("navigator.mimeTypes[0] != navigator.plugins[0][0]");
test("navigator.mimeTypes[0].enabledPlugin == navigator.plugins[0]");

