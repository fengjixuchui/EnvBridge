function isInstanceOf(obj, constructor) 
{
    return obj.__proto__ == constructor.prototype;
}