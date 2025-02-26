function HTMLDocument() 
{ 
    __obj.addLog("HTMLDocument 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function Node() 
{ 
    __obj.addLog("Node 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function Document() {};

var document = {};
document.__proto__ = HTMLDocument.prototype;
HTMLDocument.prototype.__proto__ = Document.prototype;
Document.prototype.__proto__ = Node.prototype;
Node.prototype.__proto__ = EventTarget.prototype;

Object.defineProperties(HTMLDocument.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDocument",
        configurable: true
    }
});
Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: "Node",
        configurable: true
    }
});
Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true
    }
});
__obj.toStringNative(Document, "Document");
__obj.toStringNative(Node, "Node");
__obj.toStringNative(HTMLDocument, "HTMLDocument");
