using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.API.PostModel;
using Server.Core.DTOs;
using Server.Core.IServices;
using Server.Service;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly IExamService _examService;
        private readonly ITopicService _topicService;
        private readonly IMapper _mapper;

        public StorageController(
            IStorageService storageService,
            IExamService examService,
            ITopicService topicService,
            IMapper mapper)
        {
            _storageService = storageService;
            _examService = examService;
            _topicService = topicService;
            _mapper = mapper;
        }

     
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] ExamPostModel examPostModel)
        {
            if (examPostModel.File == null || examPostModel.File.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var objectName = examPostModel.File.FileName;
            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(examPostModel.File.FileName)}";
            var filePath = Path.Combine(Path.GetTempPath(), uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await examPostModel.File.CopyToAsync(stream);
            }

            var topicDto = _mapper.Map<TopicDto>(examPostModel.Topic);
            var addedTopic = await _topicService.AddTopicAsync(topicDto);


            if (addedTopic == null)
            {
                return BadRequest("Failed to add topic.");
            }

            var examDto = _mapper.Map<ExamDto>(examPostModel);
            examDto.TopicId = addedTopic.Id;
            examDto.UniqueFileName = uniqueFileName;
            examDto.ExamName = Path.GetFileNameWithoutExtension(objectName);
            examDto.ExamPath = $"https://storage.cloud.google.com/exams-bucket/{uniqueFileName}";
            examDto.Size = examPostModel.File.Length;
            examDto.ExamType = examPostModel.File.ContentType;
            examDto.ExamExtension = Path.GetExtension(examPostModel.File.FileName);
            examDto.CreatedAt = DateTime.Now;
            examDto.UpdatedAt = DateTime.Now;
            examDto.IsDeleted = false;

            await _examService.AddExamAsync(examDto);
            try
            {
                await _storageService.UploadFileAsync(filePath, uniqueFileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading file: {ex.Message}");
            }

            System.IO.File.Delete(filePath);

            

            return Ok($"File {objectName} uploaded and exam details saved successfully.");
        }


        [HttpDelete("{fileName}")]
        public async Task<IActionResult> DeleteFile(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest("File name cannot be null or empty.");
            }

            try
            {
                bool result = await _storageService.DeleteFileAsync(fileName);
                if (!result)
                {
                    return NotFound("File not found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting file: {ex.Message}");
            }

            return NoContent(); // מחזיר 204 No Content אם המחיקה הצליחה
        }

    }
}