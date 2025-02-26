const path = require('path');

const { readJsFile } = require("./readFile");

// 获取要补环境的代码，传入 examples 文件夹中文件名
function getCode(file_name)
{
    let absolute_path = path.resolve(__dirname, "..", "examples", file_name);
    
    return readJsFile(absolute_path);

    let code = ";(function ()\n{\n";
    code += readJsFile(absolute_path);
    code += '\n}).call(window);\n';

    return code;
}

module.exports = { getCode };