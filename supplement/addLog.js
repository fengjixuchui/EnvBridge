function addLog(text)
{
    obj["history"] += text;
    if (obj["is_print"]) console.log(text);
}