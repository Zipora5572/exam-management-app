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
    }
}