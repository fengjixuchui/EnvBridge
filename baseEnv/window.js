let window = global;

delete global;

let Window = function Window() 
{
    throw new TypeError("Illegal constructor");
};

console.log(111);
