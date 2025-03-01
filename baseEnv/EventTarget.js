eval(__obj.defineNativeObject("EventTarget"));

// 全局的事件监听写在 __obj.memory 中
__obj.memory.event_listeners = new Map();

/**
 * 方法实现
 */
__obj.defineNativeMethod(EventTarget.prototype, "addEventListener", 
    function addEventListener(type, listener, options)
    {
        if (options != undefined) debugger;

        let event_listener = __obj.memory.event_listeners.get(this);
        if (event_listener == undefined) 
        {
            event_listener = {}
            __obj.memory.event_listeners.set(this, event_listener);
        }
    
        if (event_listener[type] == undefined)
        {
            event_listener[type] = [];
        }    
        
        event_listener[type].push(listener);
        return true;
    }
)

__obj.defineNativeMethod(EventTarget.prototype, "removeEventListener", 
    function removeEventListener(type, listener, options)
    {
        if (options != undefined) debugger;

        let event_listener = __obj.memory.event_listeners.get(this);
        let arr = event_listener[type];
        for (let i = 0; i < arr.length; ++i)
        {
            if (arr[i] == listener) arr.splice(i, 1);
        }
    }
)

__obj.defineNativeMethod(EventTarget.prototype, "dispatchEvent", 
    function dispatchEvent(event)
    {
        let event_listener = __obj.memory.event_listeners.get(this);
        if (!event_listener) return false;

        let arr = event_listener[event.type];
        if (!arr) return false;

        for (let listener of arr)
        {
            listener.call(this, event);
        }
    }
)
