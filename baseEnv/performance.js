eval(__obj.defineNativeObject("Performance", "EventTarget"));

performance = {};
performance.__proto__ = Performance.prototype;

