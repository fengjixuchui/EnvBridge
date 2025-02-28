function HTMLDocument() 
{ 
    __obj.log("HTMLDocument 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

function Document() {};

var document = {};
document.__proto__ = HTMLDocument.prototype;
HTMLDocument.prototype.__proto__ = Document.prototype;
Document.prototype.__proto__ = Node.prototype;

Object.defineProperties(HTMLDocument.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDocument",
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
__obj.toStringNative(HTMLDocument, "HTMLDocument");

/**
 * 方法实现
 */
__obj.defineNativeFunc(Document.prototype, "createEvent", 
    function createEvent(event_type) 
    {
    let enent = {};
    switch (event_type) 
    {
        case 'CustomEvent':
            enent.__proto__ = CustomEvent.prototype;
            break;
    
        default:
            debugger;
    }

    return enent;
    }
)