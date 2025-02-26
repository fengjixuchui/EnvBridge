function addLog(text)
{
    __obj["history"] += text;
    __obj["history"] += "\n";
    if (__obj["is_print"]) console.log(text);
}