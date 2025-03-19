public interface IStorageService
{
    Task UploadFileAsync(string filePath, string objectName);
    Task<bool> DeleteFileAsync(string fileName);
    Task<Stream> DownloadFileAsync(string fileName); 
}
