const path = require('path');

const { readJsFile, readJsFiles, isJsFile } = require("./readFile");

function getEnv(obj_name)
{
    let code = "";
    let base_env_path = path.resolve(__dirname, "..", "baseEnv");

    // 无顺序的加载
    code += readJsFiles(base_env_path);
    // // 有顺序的加载
    // let files = ["EventTarget.js", "window.js", "screen.js", "navigator.js", "location.js", "localStorage.js", "history.js", "document.js"];
    // for (let file of files)
    // {
    //     code += readJsFile(path.resolve(base_env_path, file));
    // }

    code += readJsFile(path.resolve(__dirname, "..", "supplement", "extras.js"));
    code += readJsFile(path.resolve(__dirname, "..", "supplement", "env.js"));

    // 为了支持一件改名，将环境代码中 __obj 替换
    code = code.replace(/__obj/g, obj_name);

    return code;
}

module.exports = { getEnv };