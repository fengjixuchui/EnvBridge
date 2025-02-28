// 创建一个插件对象
function newPlugin(data)
{
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
