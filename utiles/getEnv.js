const path = require('path');

const { readJsFile, readJsFiles, isJsFile } = require("./readFile");

function getEnv(obj_name)
{
    let code = "";
    let base_env_path = path.resolve(__dirname, "..", "baseEnv");
    code += readJsFiles(base_env_path);
    code += readJsFile(path.resolve(__dirname, "..", "supplement", "extrasEnv.js"));

    // 为了支持一件改名，将环境代码中 __obj 替换
    code = code.replace(/__obj/g, obj_name);

    return code;
}

module.exports = { getEnv };