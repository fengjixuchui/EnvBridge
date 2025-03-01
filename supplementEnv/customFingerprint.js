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
    __obj.insertPlugins(nothing.newPlugin(tmp));
}
// navigator.mimeTypes
for (let i = 0; i < __obj.memory.mime_types.length; i++)
{
    let tmp = __obj.memory.mime_types[i];
    tmp.plugin = navigator.plugins[0];
    __obj.insertMimeTypes(nothing.newMimeType(tmp));
}

document.currentScript = null;
document.readyState = "loading";

__obj.defineNativeMethod(window, "fetch", 
    function fetch(data)
    {
        console.log("fetch", data);
    }
)

// 最后再开启 hook
debugger;
__obj.is_hook_proxyhandler = true;
