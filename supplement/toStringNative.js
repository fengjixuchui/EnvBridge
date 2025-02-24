;(function (obj, name) 
{
    let toString = Function.toString;
    delete Function.prototype['toString'];

    const symbol = Symbol((Math.round(Math.random() * 10 ** (Math.random() * 10 + 1))).toString(36));

    function newToString() {
        if (typeof this == 'function' && this[symbol])
            return this[symbol];
        else
            return toString.call(this);
    }
    function setProperty(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            "configurable": true,
            "writable": true,
            "value": value
        });
    }
    setProperty(Function.prototype, "toString", newToString);
    obj[name] = (func, funcName) => {
        setProperty(func, symbol, `function ${funcName}() { [native code] }`);
    };
    obj[name](Function.prototype.toString, "toString");
})(globalThis, "toStringNative");
