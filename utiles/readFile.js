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
// 读取一个目录下所有的 js 文件，返回 { path: code }
function loadJsFiles(dir) {
    let files = fs.readdirSync(dir);
    let ret = {};

    for (let file of files)
    {
        let file_path = path.resolve(dir, file);

        if (isJsFile(file))
        {
            ret[file_path] = readJsFile(file_path);
        } 
        else 
        {
            let child = loadJsFiles(file_path);
            for (let key in child)
            {
                ret[key] = child[key];
            }
        }
    }

    return ret;
}
// 读取一个目录下所有的 js 文件，拼接后返回，支持优先加载
function readJsFiles(dir, priority)
{
    let code_map = loadJsFiles(dir);
    let code = ""

    if (priority != undefined)
    {
        for (let key of priority)
        {
            code += code_map[key];
            delete code_map[key];
        }
    }
    for (let key in code_map) code += code_map[key];

    return code;
}
// 获取一个目录下所有 js 文件的文件名
function getJsFilesName(dir)
{
    let files = fs.readdirSync(dir);
    let ret = [];

    for (let file of files)
    {
        let file_path = path.resolve(dir, file);

        if (isJsFile(file))
        {
            ret.push(path.parse(file_path).name);
        } 
        else 
        {
            let child = getJsFilesName(file_path);
            ret.push(...child);
        }
    }

    return ret;
}

module.exports = { readJsFile, readJsFiles, isJsFile, loadJsFiles, getJsFilesName };
