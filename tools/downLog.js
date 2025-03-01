
// 下载日志 nothing.downLog();
function downLog(property="history", name="log.txt")
{
    const fs = require('fs');
    const path = require('path');

    file_path = path.resolve(".", name);
    fs.writeFileSync(file_path, this[property]);
}