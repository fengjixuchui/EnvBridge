// 新的 toString
function newToString() 
{
    if (typeof this == 'function' && this[symbol])
        return this[symbol];
    else
        return toString.call(this);
}
// 精简版设置属性
function setProperty(func, key, value) 
{
    Object.defineProperty(func, key, {
        "enumerable": false,
        "configurable": true,
        "writable": true,
        "value": value
    });
}

function toStringNative(func, funcName)
{
    setProperty(func, symbol, `function ${funcName}() { [native code] }`);
}

let toString = Function.toString;
delete Function.prototype['toString'];

const symbol = Symbol((Math.round(Math.random() * 10 ** (Math.random() * 10 + 1))).toString(36));

setProperty(Function.prototype, "toString", newToString);
toStringNative(Function.prototype.toString, "toString");
