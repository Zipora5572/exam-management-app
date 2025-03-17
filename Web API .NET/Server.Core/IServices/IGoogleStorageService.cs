using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.IServices
{
   
        public interface IGoogleStorageService
        {
            Task UploadFileAsync(string filePath, string objectName);
        }
    
}
