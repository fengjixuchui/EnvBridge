const fs = require("fs");
const path = require('path');

function isJsFile(name)
{
    return name.slice(-3) == ".js";
}
// 统一读取文件的接口
function readJsFile(file_path)
{
    let code = "";
    code += `// file path: ${file_path}\n`;
    code += fs.readFileSync(file_path, 'utf8');
    code += "\n";

    return code;
}
// 读取一个目录下所有的 js 文件，拼接后返回
function readJsFiles(dir) {
    let files = fs.readdirSync(dir);
    let code = "";
    
    for (let file of files)
    {
        let file_path = path.resolve(dir, file);

        if (isJsFile(file)) code += readJsFile(file_path);
        else code += readJsFiles(file_path);
    }

    return code;
}

module.exports = { readJsFile, readJsFiles, isJsFile };
