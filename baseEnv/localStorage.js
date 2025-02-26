function Storage() 
{ 
    __obj.addLog("Storage 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var localStorage = {};
localStorage.__proto__ = Storage.prototype;