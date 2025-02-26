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

// 补充方法（无法像 envProxy, toStringNative... 这些函数那样，写在文件的最开头）。

// 检查是否是某个对象的实例
__obj.isInstanceOf = (obj, constructor) => {
    return obj.__proto__ == constructor.prototype;
}
// 创建一个 MIME 类型对象
__obj.newMimeType = (data) => {
    if (!__obj.isInstanceOf(data.plugin, Plugin)) throw new Error("data.plugin 需要是 Plugin 的实例.");
    
    let mime_type = {};
    mime_type.__proto__ = MimeType.prototype;
    mime_type.description = data.description;
    mime_type.suffixes = data.suffixes;
    mime_type.type = data.type;
    // plugin 是 __obj.newPlugin 出来的 
    mime_type.enabledPlugin = data.plugin;

    return mime_type;
}
// 创建一个插件对象
__obj.newPlugin = (data) => {
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
            let mime_type = __obj.newMimeType(mime_type_data);

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
__obj.insert_plugins = (plugin) => {
    // 做一个检查
    if (!__obj.isInstanceOf(plugin, Plugin)) throw new Error("plugin 需要是 Plugin 的实例.");

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
__obj.insert_mime_types = (mime_type) => {
    // 做一个检查
    if (!__obj.isInstanceOf(mime_type, MimeType)) throw new Error("mime_type 需要是 MimeType 的实例.");

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