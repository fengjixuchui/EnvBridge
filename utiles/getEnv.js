const path = require('path');

const { readJsFile, readJsFiles, isJsFile } = require("./readFile");

function getEnv()
{
    let code = "";
    let base_env_path = path.resolve(__dirname, "..", "baseEnv");
    code += readJsFiles(base_env_path);
    code += readJsFile(path.resolve(__dirname, "..", "supplement", "extrasEnv.js"));

    return code;
}

module.exports = { getEnv };