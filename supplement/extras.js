delete global;

// EventTarget 的修补
Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true
    }
})
__obj.toStringNative(EventTarget, "EventTarget");

// window 的修补
Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true
    }
});
Object.defineProperties(WindowProperties.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowProperties",
        configurable: true
    }
});
WindowProperties = undefined;
__obj.toStringNative(Window, "Window");

// navigator 的修补
Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true
    }
});
__obj.toStringNative(Navigator, "Navigator");

// localStorage 的修补
Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true
    }
});
__obj.toStringNative(Storage, "Storage");

// screen 
Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true
    }
});
__obj.toStringNative(Screen, "Screen");

// history
Object.defineProperties(History.prototype, {
    [Symbol.toStringTag]: {
        value: "History",
        configurable: true
    }
});
__obj.toStringNative(History, "History");

// location
Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: "Location",
        configurable: true
    }
});
__obj.toStringNative(Location, "Location");

// document
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

// 统一代理
__obj.init_proxy_object_1 = ["window", "navigator", "localStorage", "screen", "history", "location", "document"];
__obj.init_proxy_object_2 = [
    "EventTarget", "Window", "Navigator", "Storage", "Screen", "History", "Location", "HTMLDocument", "Node", "Document",
];
for (let obj of __obj.init_proxy_object_1)
{
    eval(`${obj} = __obj.envProxy(${obj}, "${obj}");`)
}

// 要写在代理后
window.window = window;
window.self = window;

