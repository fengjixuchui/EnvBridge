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

Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true
    }
});
Object.defineProperties(WindowProperties.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowProperties",
        configurable: true
    }
});
__obj.toStringNative(Window, "Window");