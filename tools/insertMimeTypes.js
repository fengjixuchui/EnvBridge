// 为 navigator.mimeTypes 添加
function insertMimeTypes(mime_type)
{
   // 做一个检查
   if (!__obj.isInstanceOf(mime_type, MimeType)) throw new Error("mime_type 需要是 MimeType 的实例.");

   if (navigator.mimeTypes.length == undefined)
   {
       navigator.mimeTypes.length = 1;
       navigator.mimeTypes[0] = mime_type;
       navigator.mimeTypes[mime_type.type] = mime_type;
   }
   else
   {
       // 考虑了重复插入的情况
       if (navigator.mimeTypes[mime_type.type] == undefined)
       {
           navigator.mimeTypes[navigator.mimeTypes.length] = mime_type;
           navigator.mimeTypes[mime_type.type] = mime_type;
           navigator.mimeTypes.length++;
       }
       else 
       {
           // 重复插入就替换
           navigator.mimeTypes[mime_type.type] = mime_type;
           for (let i = 0; i < navigator.mimeTypes.length; ++i)
           {
               if (navigator.mimeTypes[i].type == mime_type.type)
               {
                   navigator.mimeTypes[i] = mime_type;
                   break;
               }
           }
       }
   }
}