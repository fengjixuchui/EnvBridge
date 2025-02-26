delete global;

WindowProperties = undefined;

// 统一代理
__obj.init_proxy_object_1 = [
    "window", "navigator", "localStorage", "screen", "history", "location", "document", "navigation", "navigator.plugins", 
    "navigator.mimeTypes",
];
__obj.init_proxy_object_2 = [
    "EventTarget", "Window", "Navigator", "Storage", "Screen", "History", "Location", "HTMLDocument", "Node", "Document",
    "Navigation", "Plugin", "PluginArray", "MimeType", "MimeTypeArray",
];

if (__obj.is_proxy)
{
    for (let obj of [...__obj.init_proxy_object_1, ...__obj.init_proxy_object_2])
    {
        eval(`${obj} = __obj.envProxy(${obj}, "${obj}");`)
    }
}

// 要写在代理后
window.window = window;
window.self = window;