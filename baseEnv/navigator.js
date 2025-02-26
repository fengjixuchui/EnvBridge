function Navigator() 
{ 
    __obj.addLog("Navigator 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

// 不能用 let
var navigator = {};
navigator.__proto__ = Navigator.prototype;

Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true
    }
});
__obj.toStringNative(Navigator, "Navigator");