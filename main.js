const path = require('path');
const  fs = require('fs');
const { VM, VMScript } = require("vm2");

const { readJsFile } = require("./utiles/readFile");
const { getEnv } = require("./utiles/getEnv");
const { getTools } = require("./utiles/getTools");

let code = "";
// 唯一暴露对象的名字
let obj_name = "nothing";

// 拼装代码
code += getTools(obj_name);
code += getEnv();
code += readJsFile(path.resolve(__dirname, "examples", "shape.js"))

// 生成完整代码保存下来
let code_path = path.resolve(__dirname, "run.js");
fs.writeFileSync(code_path, code);
// 用 vm2 运行
const script = new VMScript(code, code_path);
const vm = new VM();
vm.run(script); 