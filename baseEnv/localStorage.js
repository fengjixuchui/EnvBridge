eval(__obj.defineNativeObject("Storage"));

localStorage = {};
localStorage.__proto__ = Storage.prototype;
