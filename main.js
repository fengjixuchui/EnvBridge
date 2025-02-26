const path = require('path');
const  fs = require('fs');
const { VM, VMScript } = require("vm2");

const { getEnv } = require("./utiles/getEnv");
const { getTools } = require("./utiles/getTools");
const { getCode } = require("./utiles/getCode");

let code = "";
// 唯一暴露对象的名字，可以一键改名
let obj_name = "nothing";
// 要运行的代码，examples 文件夹中文件名
let file_name = "shape.js";
// 配置
let init_config = {
    is_proxy: true,                         // 是否代理对象
    is_hook_proxyhandler: false,            // 是否拦截代理对象的 get、set、has 等句柄
    is_print: true,                         // 是否用 console.log 打印出来
    history: "",                            // 日志历史，在调试过程中，可 copy(nothing.history) 复制日志出来
    memory: {},                             // 缓存
}

// 拼装代码
code += getTools(obj_name, init_config);
code += getEnv(obj_name);
code += getCode(file_name);

// 生成完整代码保存下来
let code_path = path.resolve(__dirname, "run.js");
fs.writeFileSync(code_path, code);
// 用 vm2 运行
const script = new VMScript(code, code_path);
const vm = new VM();
vm.run(script); 