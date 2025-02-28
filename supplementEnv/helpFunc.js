/**
 * 补充方法（依赖环境的方法，无法像 envProxy, toStringNative... 这些函数那样，写在文件的最开头）。
 */
// 检查是否是某个对象的实例
__obj.isInstanceOf = (obj, constructor) => {
    return obj.__proto__ == constructor.prototype;
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


/**
 * 一些零散的代码
 */
// 统一代理
__obj.init_proxy_object_1 = [
    "window", "navigator", "localStorage", "screen", "history", "location", "document", "navigation", "navigator.plugins", 
    "navigator.mimeTypes",
];
__obj.init_proxy_object_2 = [
    "EventTarget", "Window", "Navigator", "Storage", "Screen", "History", "Location", "HTMLDocument", "Node", "Document",
    "Navigation", "Plugin", "PluginArray", "MimeType", "MimeTypeArray", "Event",
];

if (__obj.is_proxy)
{
    for (let obj of [...__obj.init_proxy_object_1, ...__obj.init_proxy_object_2])
    {
        eval(`${obj} = __obj.envProxy(${obj}, "${obj}");`)
    }
}

delete global;
WindowProperties = undefined;
// 要写在代理后
window.window = window;
window.self = window;
globalThis = window;
// this 没法改，偷偷存一个
// this = window; 
__obj.memory.this = this;