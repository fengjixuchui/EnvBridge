function Screen() 
{ 
    __obj.log("Screen 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var screen = {};
screen.__proto__ = Screen.prototype;
Screen.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true
    }
});
__obj.toStringNative(Screen, "Screen");