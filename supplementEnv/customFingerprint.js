__obj.memory.plugins = [
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
__obj.memory.mime_types = [
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
for (let i = 0; i < __obj.memory.plugins.length; i++)
{
    let tmp = __obj.memory.plugins[i];
    // 注意并不是所有的 __obj.memory.mime_types 都要赋值上，一般是选一个或几个
    tmp.mime_types = __obj.memory.mime_types;
    __obj.insert_plugins(nothing.newPlugin(tmp));
}
// navigator.mimeTypes
for (let i = 0; i < __obj.memory.mime_types.length; i++)
{
    let tmp = __obj.memory.mime_types[i];
    tmp.plugin = navigator.plugins[0];
    __obj.insert_mime_types(nothing.newMimeType(tmp));
}

EventTarget.prototype.addEventListener = function addEventListener(type, listener, options)
{
    if (options != undefined) debugger;

    // 全局调用与示例调用区分
    let  event_listeners;
    if (this == nothing.memory.this) event_listeners = __obj.memory.event_listeners;
    else 
    {
        if (__obj.memory.event_listeners_instance_map.has(this))
        {
            event_listeners = __obj.memory.event_listeners_instance_map.get(this);
        }
        else 
        {
            event_listeners = {};
            __obj.memory.event_listeners_instance_map.set(this, event_listeners);
        }
    }

    event_listeners[type] = listener;
}



// 最后再开启 hook
debugger;
// __obj.is_hook_proxyhandler = true;