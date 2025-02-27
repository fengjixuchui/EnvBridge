function test(str, )
{
    let result = eval(str);
    if (result == true)
    {
        console.log(`[test] ${str}......success.`);
    }
    else 
    {
        console.error(`[test] ${str}......failed.`);
    }
}

test("window.window == window");
test("this == window");
test("globalThis == window");

test("window.toString() == '[object Window]'");
test("Window.toString() == 'function Window() { [native code] }'");
test("document.toString() == '[object HTMLDocument]'");

test("navigator.plugins.toString() == '[object PluginArray]'");
test("navigator.mimeTypes.toString() == '[object MimeTypeArray]'");
test("navigator.plugins[0].toString() == '[object Plugin]'");
test("navigator.mimeTypes[0].toString() == '[object MimeType]'");

test("navigator.mimeTypes[0].enabledPlugin[0] != navigator.mimeTypes[0]");
test("navigator.mimeTypes[0] != navigator.plugins[0][0]");
test("navigator.mimeTypes[0].enabledPlugin == navigator.plugins[0]");
