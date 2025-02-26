let window = globalThis;

function Window() 
{
    __obj.addLog("Window 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function WindowProperties() {};

window.__proto__ = Window.prototype;
Window.prototype.__proto__ = WindowProperties.prototype;
WindowProperties.prototype.__proto__ = EventTarget.prototype;