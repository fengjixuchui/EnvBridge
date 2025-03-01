eval(__obj.defineNativeObject("Document", "Node"));
eval(__obj.defineNativeObject("HTMLDocument", "Document"));

document = {};
document.__proto__ = HTMLDocument.prototype;

/**
 * 属性实现
 */


/**
 * 方法实现
 */
__obj.defineNativeMethod(Document.prototype, "createEvent", 
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

    return __obj.envProxy(enent, event_type);
    }
)