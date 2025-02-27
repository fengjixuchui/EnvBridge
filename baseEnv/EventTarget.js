function EventTarget() {};

Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true
    }
})
__obj.toStringNative(EventTarget, "EventTarget");

// 全局的事件监听写在 __obj.memory 中
__obj.memory.event_listeners = {};
__obj.memory.event_listeners_instance_map = new Map();

// 补充 addEventListener removeEventListener dispatchEvent 方法
EventTarget.prototype.addEventListener = function addEventListener(type, listener, options = false)
{
    // 处理默认参数
    const { capture = false, once = false, passive = false, signal } = typeof options === 'object' ? options : { capture: options };
    if (passive) __obj.addLog("addEventListener: 默认参数的 passive 设置为了 true,可能是检测.");
    
    // 全局调用与示例调用区分
    let  event_listeners;
    if (this == nothing.memory.this) event_listeners = __obj.memory.event_listeners;
    else 
    {
        if (__obj.memory.event_listeners_instance_map.has(this))
        {
            event_listeners = __obj.memory.event_listeners_instance_map.get(this);
        }
        else 
        {
            event_listeners = {};
            __obj.memory.event_listeners_instance_map.set(this, event_listeners);
        }
    }
    // 实现
    if (!event_listeners[type])
    {
        event_listeners[type] = { capture: [], bubble: [] };
    }

    const list = event_listeners[type][capture ? 'capture' : 'bubble'];
    const listener_object = { listener, once, passive, capture };

    // 没有相同的 listener 就加入内存中
    if (!list.some(l => l.listener === listener))
    {
        list.push(listener_object);
        // 如果提供了 AbortSignal，监听 abort 事件来移除监听器
        if (signal)
        {
            signal.addEventListener('abort', () => {
                this.removeEventListener(type, listener, { capture });
            });
        }
    }
}
EventTarget.prototype.removeEventListener = function removeEventListener(type, listener, options = false)
{
     // 处理默认参数
    const { capture = false } = typeof options === 'object' ? options : { capture: options };
    // 全局调用与示例调用区分
    let  event_listeners;
    if (this == nothing.memory.this) event_listeners = __obj.memory.event_listeners;
    else 
    {
        if (__obj.memory.event_listeners_instance_map.has(this))
        {
            event_listeners = __obj.memory.event_listeners_instance_map.get(this);
        }
        else 
        {
            __obj.addLog("removeEventListener: 删除了一个未注册的事件,可能是检测.");
            return;
        }
    }
    // 检查
    if (!event_listeners[type]) 
    {
        __obj.addLog("removeEventListener: 删除了一个未注册的事件,可能是检测.");
        return;
    }

    const list = event_listeners[type][capture ? 'capture' : 'bubble'] || [];
    // 检查
    if (list.length == 0) 
    {
        __obj.addLog("removeEventListener: 删除了一个未注册的事件,可能是检测.");
        return;
    }
    event_listeners[type][capture ? 'capture' : 'bubble'] = list.filter(l => l.listener !== listener);
}
EventTarget.prototype.dispatchEvent = function dispatchEvent(event)
{
    const { type, target, cancelable } = event;
    // 全局调用与示例调用区分
    let  event_listeners;
    if (this == nothing.memory.this) event_listeners = __obj.memory.event_listeners;
    else 
    {
        if (__obj.memory.event_listeners_instance_map.has(this))
        {
            event_listeners = __obj.memory.event_listeners_instance_map.get(this);
        }
        else 
        {
            __obj.addLog("dispatchEvent: 触发了一个未注册的事件,可能是检测.");
            return;
        }
    }

    const listeners = event_listeners[type];
    if (!listeners) return true;

    let defaultPrevented = false;
    const handleEvent = (list, event) => {
        for (const listenerObject of list) 
        {
            if (listenerObject.once) 
                this.removeEventListener(type, listenerObject.listener, { capture: listenerObject.capture });
            

            if (!listenerObject.passive && event.preventDefault) 
            {
                event.preventDefault = () => {
                    defaultPrevented = true;
                };
            }

            try {
                listenerObject.listener.call(target, event);
            } catch (error) {
                console.error('Error in event listener:', error);
            }
        }
    };

    // 捕获阶段
    if (listeners.capture) handleEvent(listeners.capture, event);

    // 目标阶段
    if (listeners.bubble) handleEvent(listeners.bubble, event);

    return !defaultPrevented || !cancelable;
}
