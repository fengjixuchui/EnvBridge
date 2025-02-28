function Event() 
{ 
    __obj.log("Event 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

Object.defineProperties(Event.prototype, {
    [Symbol.toStringTag]: {
        value: "Event",
        configurable: true
    }
});
__obj.toStringNative(Event, "Event");