// 为 navigator.plugins 添加
function insertPlugins(plugin)
{
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
