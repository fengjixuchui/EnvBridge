function EventTarget() {};

Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true
    }
})
__obj.toStringNative(EventTarget, "EventTarget");