const path = require('path');

const { readJsFile, readJsFiles } = require("./readFile");

// 获取环境代码
function getEnv(obj_name)
{
    let code = "";
    let base_env_path = path.resolve(__dirname, "..", "baseEnv");
    let supplement_env_path = path.resolve(__dirname, "..", "supplementEnv");

    code += readJsFiles(base_env_path);;
    code += readJsFile(path.resolve(supplement_env_path, "extraAdditions.js"));
    code += readJsFile(path.resolve(supplement_env_path, "customFingerprint.js"));

    // 为了支持一件改名。将环境代码中 __obj 替换
    code = code.replace(/__obj/g, obj_name);

    return code;
}

module.exports = { getEnv };