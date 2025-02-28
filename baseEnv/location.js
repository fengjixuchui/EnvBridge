function Location()
{
    __obj.log("Location 被 new 了，报错，可能是查看堆栈检测。");
    throw new TypeError("Illegal constructor");
};

var location = {};
location.__proto__ = Location.prototype;

Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: "Location",
        configurable: true
    }
});
__obj.toStringNative(Location, "Location");