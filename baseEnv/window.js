eval(__obj.defineNativeObject("WindowProperties", "EventTarget"));
eval(__obj.defineNativeObject("Window", "WindowProperties"));

window = globalThis;
window.__proto__ = Window.prototype;
