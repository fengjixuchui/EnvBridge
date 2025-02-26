function Navigation() 
{ 
    __obj.addLog("Navigation 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var navigation = {};
navigation.__proto__ = Navigation.prototype;
Navigation.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(Navigation.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigation",
        configurable: true
    }
});
__obj.toStringNative(Navigation, "Navigation");