function CustomEvent() 
{ 
    __obj.log("CustomEvent 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

Object.defineProperties(CustomEvent.prototype, {
    [Symbol.toStringTag]: {
        value: "CustomEvent",
        configurable: true
    }
});
__obj.toStringNative(CustomEvent, "CustomEvent");

/**
 * 方法实现
 */
__obj.defineNativeFunc(CustomEvent.prototype, "initCustomEvent", 
    function initCustomEvent(type, can_bubble, can_celable, detail)
    {

    }
)