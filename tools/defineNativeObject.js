// 创建浏览器对象
function defineNativeObject(object_name, parent_name="Object")
{
    let code = `
    function ${object_name}()
    {
        ${this.name}.log("${object_name} 被 new 了，可能是检测。");
    }
    ${object_name}.prototype.__proto__ = ${parent_name}.prototype;
    Object.defineProperties(${object_name}.prototype, {
        [Symbol.toStringTag]: {
            value: "${object_name}",
            configurable: true
        }
    });
    ${this.name}.toStringNative(${object_name}, "${object_name}");
    `
    return code;
}