using Google.Cloud.Storage.V1;
using HeyRed.Mime;
using Google.Apis.Storage.v1.Data;
using Google.Cloud.Storage.V1;
using Microsoft.Extensions.Configuration;
using Server.Core.IServices;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Google.Apis.Storage.v1.Data;
using Google.Cloud.Storage.V1;
using System;
using System.Collections.Generic;
using static Google.Apis.Storage.v1.Data.Bucket;
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
            BucketAddCorsConfiguration();
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

        public Bucket BucketAddCorsConfiguration()
        {
           
            var bucket = _storageClient.GetBucket(_bucketName);

            CorsData corsData = new CorsData
            {
                Origin = new string[] { "*" },
                ResponseHeader = new string[] { "Content-Type", "x-goog-resumable" },
                Method = new string[] { "PUT", "POST" },
                MaxAgeSeconds = 3600 // שעה אחת
            };

            if (bucket.Cors == null)
            {
                bucket.Cors = new List<CorsData>();
            }
            bucket.Cors.Add(corsData);

            bucket = _storageClient.UpdateBucket(bucket);
            Console.WriteLine($"bucketName {_bucketName} was updated with a CORS config to allow {string.Join(",", corsData.Method)} requests from" +
                $" {string.Join(",", corsData.Origin)} sharing {string.Join(",", corsData.ResponseHeader)} responseHeader" +
                $" responses across origins.");
            return bucket;
        }

    }

}