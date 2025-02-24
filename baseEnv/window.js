let window = global;
window.window = window;
window.self = window;
delete global;

let Window = function Window() 
{
    __obj.addLog("Window 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

