eval(__obj.defineNativeObject("Crypto"));

crypto = {};
crypto.__proto__ = Crypto.prototype;