function Plugin() 
{ 
    __obj.addLog("Plugin 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function PluginArray() 
{ 
    __obj.addLog("PluginArray 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function MimeType() 
{ 
    __obj.addLog("MimeType 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function MimeTypeArray() 
{ 
    __obj.addLog("MimeTypeArray 被 new 了，报错，可能是查看堆栈检测。");
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
__obj.toStringNative(Plugin, "Plugin");
__obj.toStringNative(MimeType, "MimeType");
__obj.toStringNative(PluginArray, "PluginArray");
__obj.toStringNative(MimeTypeArray, "MimeTypeArray");

