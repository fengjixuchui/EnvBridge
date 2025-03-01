eval(__obj.defineNativeObject("Plugin"));
eval(__obj.defineNativeObject("PluginArray"));
eval(__obj.defineNativeObject("MimeType"));
eval(__obj.defineNativeObject("MimeTypeArray"));

navigator.plugins = {};
navigator.mimeTypes = {};
navigator.plugins.__proto__ = PluginArray.prototype;
navigator.mimeTypes.__proto__ = MimeTypeArray.prototype;


