const path = require('path');

const { readJsFile, getJsFilesName } = require("./readFile");

// 将代码用自执行函数包裹起来
function addDecorator(code, obj_name, target_name)
{
    let new_code = "";
    new_code += ";(function (__obj)\n{\n";
    new_code += code;
    new_code += '\n';
    new_code += `__obj.${target_name} = ${target_name};\n`;
    new_code += `\n})(${obj_name});\n`;

    return new_code;
}

// 获取方便补环境的工具代码，传入唯一暴露对象的名字和配置对象
function getTools(obj_name, init_config)
{
    let tools_path = path.resolve(__dirname, "..", "tools");
    let file_names = getJsFilesName(tools_path);
    
    let code = `let ${obj_name} = ${JSON.stringify(init_config)};\n`;
    for (let file_name of file_names)
    {
        let tmp = readJsFile(path.resolve(tools_path, `${file_name}.js`))
        code += addDecorator(tmp, obj_name, file_name);
    }

    return code;
}

module.exports = { getTools };