using Google.Cloud.Storage.V1;
using HeyRed.Mime;
using Microsoft.Extensions.Configuration;
using Server.Core.IServices;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Server.Service
{
    public class StorageService : IStorageService
    {
        private readonly string _bucketName;
        private readonly StorageClient _storageClient;

        public StorageService(IConfiguration configuration)
        {
            var credentialPath = @"C:\Users\user1\Desktop\ציפי לימודים שנה ב\Fullstack Project\Web API .NET\Server.service\exams-management-service.json";

            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);

            _bucketName = configuration["GoogleCloud:BucketName"];
            _storageClient = StorageClient.Create();
        }

        public async Task UploadFileAsync(string filePath, string objectName)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"The file {filePath} does not exist.");
            }

            try
            {
                using (var fileStream = File.OpenRead(filePath))
                {
                    string contentType = MimeTypesMap.GetMimeType(filePath);
                    await _storageClient.UploadObjectAsync(_bucketName, objectName, contentType, fileStream);
                    Console.WriteLine($"File {objectName} uploaded to bucket {_bucketName}.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw; 
            }
        }

        public async Task<bool> DeleteFileAsync(string fileName)
        {
            try
            {
                await _storageClient.DeleteObjectAsync(_bucketName, fileName);
                return true; 
            }
            catch (Google.GoogleApiException ex)
            {
                
                if (ex.HttpStatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return false; 
                }
                throw;
            }
            catch (Exception)
            {
                
                return false; 
            }
        }
        public async Task<Stream> DownloadFileAsync(string fileName)
        {
            try
            {
                var memoryStream = new MemoryStream();
                await _storageClient.DownloadObjectAsync(_bucketName, fileName, memoryStream);
                memoryStream.Position = 0; // מחזירים את המצביע להתחלה
                return memoryStream;
            }
            catch (Google.GoogleApiException ex)
            {
                if (ex.HttpStatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return null; // אם הקובץ לא נמצא
                }
                throw;
            }
            catch (Exception)
            {
                throw;
            }
        }

    }

}