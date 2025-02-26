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

test("window.toString() == '[object Window]'");
test("Window.toString() == 'function Window() { [native code] }'");
test("document.toString() == '[object HTMLDocument]'");