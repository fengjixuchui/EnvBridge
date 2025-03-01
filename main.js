const path = require('path');
const fs = require('fs');
const { VM, VMScript } = require("vm2");

const { getEnv } = require("./utiles/getEnv");
const { getTools } = require("./utiles/getTools");
const { getCode } = require("./utiles/getCode");

// 全部代码
let code = "";
// 要运行的代码，examples 文件夹中文件名
let file_name = "shape.js";
// 配置
let init_config = {
    name : "nothing",
    is_proxy: true,           
    is_hook_proxyhandler: false,         
    is_print: true,                      
    history: "",                          
    memory: {},    
    tmp: {},
}

// 拼装代码
code += getTools(init_config.name, init_config);
code += getEnv(init_config.name);
code += getCode(file_name);
code += `\ndebugger;\n// ${init_config.name}.downLog()`;

// 生成完整代码保存下来
let code_path = path.resolve(__dirname, "run.js");
fs.writeFileSync(code_path, code);
// 用 vm2 运行
const script = new VMScript(code, code_path);
const vm = new VM();
vm.run(script); 