using System.Threading.Tasks;
using Server.Core.DTOs;

namespace Server.Core.IServices
{
    public interface IStorageService
    {
        Task UploadFileAsync(string filePath, string objectName);
        Task<bool> DeleteFileAsync(string fileName);

    }
}