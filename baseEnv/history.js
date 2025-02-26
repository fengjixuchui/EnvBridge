function History() 
{ 
    __obj.addLog("History 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var history = {};
history.__proto__ = History.prototype;