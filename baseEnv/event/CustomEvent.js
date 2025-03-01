eval(__obj.defineNativeObject("CustomEvent", "Event"));

/**
 * 方法实现
 */
__obj.defineNativeMethod(CustomEvent.prototype, "initCustomEvent", 
    function initCustomEvent(type, cancelBubble, cancelable, detail)
    {
        this.type = type;
        this.cancelBubble = cancelBubble;
        this.cancelable = cancelable;
        this.detail = detail;
    }
)