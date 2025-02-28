// 创建一个 MIME 类型对象
function newMimeType(data)
{
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
