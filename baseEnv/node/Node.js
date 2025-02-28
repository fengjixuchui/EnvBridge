function Node() 
{ 
    __obj.log("Node 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

Node.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: "Node",
        configurable: true
    }
});
__obj.toStringNative(Node, "Node");