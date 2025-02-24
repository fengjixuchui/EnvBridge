const path = require('path');
const { VM } = require("vm2");

const { readJsFile } = require("./utiles/readFile");
const { getEnv } = require("./utiles/getEnv");


let code = "";
code += getEnv();
console.log(code);


const vm = new VM();
vm.run(code); 