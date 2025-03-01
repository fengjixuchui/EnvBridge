// 创建浏览器对象上的方法
function defineNativeMethod(obj, prop, func, descriptor = {})
{
    if (typeof func != "function") throw new Error("传入的 func 有误.");

    // configurable enumerable writable 默认值全为 true
    const { configurable = true, enumerable = true, writable = true } = descriptor;
    descriptor = {
        configurable, 
        enumerable,
        writable,
        value: func
    };
    Object.defineProperty(obj, prop, descriptor);
    __obj.toStringNative(obj[prop], prop);
}