/**
 * 一些零散的补充
 */

// 初始，统一代理
__obj.init_proxy_object_1 = [
    "window", "screen", "navigator.plugins", "navigator.mimeTypes", "performance", "navigator", "navigation", "location",
    "localStorage", "history", "document", "crypto",
]
__obj.init_proxy_object_2 = []
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
