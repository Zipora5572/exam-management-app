﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Server.API.PostModel;
using Server.Core.DTOs;
using Server.Core.Entities;
using Server.Core.IServices;
using System.Collections.Generic;

namespace Server.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly IExamService _examService;
        private readonly IFolderService _folderService;
        private readonly ITopicService _topicService;
        private readonly IMapper _mapper;

        public ExamController(
            IStorageService storageService,
            IExamService examService,
            IFolderService folderService,
            ITopicService topicService,
            IMapper mapper)
        {
            _storageService = storageService;
            _examService = examService;
            _folderService = folderService;
            _topicService = topicService;
            _mapper = mapper;
        }

        // GET: api/<ExamController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exam>>> Get()
        {
            List<Exam> exams = await _examService.GetAllExamsAsync();
            if (exams == null)
            {
                return NotFound();
            }
            return Ok(exams);
        }

        // GET api/<ExamController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDto>> Get(int id)
        {
            ExamDto examDto = await _examService.GetByIdAsync(id);
            if (examDto == null)
            {
                return NotFound();
            }
            return Ok(examDto);
        }

        // POST api/<ExamController>
        [HttpPost("upload")]
        public async Task<ActionResult<ExamDto>> Post([FromForm] ExamPostModel examPostModel)
        {
            if (examPostModel.File == null || examPostModel.File.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }
            string folderName, objectName="";

            if (examPostModel.FolderId != null)
            {
                int id = (int)examPostModel.FolderId; 
                var folder = await _folderService.GetByIdAsync(id);
                if (folder != null)
                { 
                    folderName = folder.FolderName;
                    objectName = $"{folderName}/{examPostModel.File.FileName}";
                }
            }
            else
            objectName = examPostModel.File.FileName;
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
            examDto.ExamNamePrefix = objectName;
            //examDto.UniqueFileName = uniqueFileName;
            examDto.ExamName = Path.GetFileNameWithoutExtension(examPostModel.File.FileName);
            examDto.ExamPath = $"https://storage.cloud.google.com/exams-bucket/{objectName}";
            examDto.Size = examPostModel.File.Length;
            examDto.ExamType = examPostModel.File.ContentType;
            examDto.ExamExtension = Path.GetExtension(examPostModel.File.FileName);
            examDto.CreatedAt = DateTime.Now;
            examDto.UpdatedAt = DateTime.Now;
            examDto.IsDeleted = false;

            var newExam=await _examService.AddExamAsync(examDto);
            try
            {
                await _storageService.UploadFileAsync(filePath, objectName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading file: {ex.Message}");
            }

            System.IO.File.Delete(filePath);



            return Ok(newExam);
        }

        // PUT api/<ExamController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Exam>> Put(int id, [FromBody] ExamPostModel examPostModel)
        {
            if (examPostModel == null)
            {
                return BadRequest("Exam cannot be null");
            }
            ExamDto examDto = _mapper.Map<ExamDto>(examPostModel);

            examDto =await _examService.UpdateExamAsync(id, examDto);
            if (examDto == null)
            {
                return NotFound();
            }
            return Ok(examDto);
        }
        // PATCH api/<ExamController>/update-name/5
        [HttpPatch("rename/{id}")]
        public async Task<ActionResult<ExamDto>> UpdateExamName(int id, [FromBody] string newName)
        {
            if (string.IsNullOrEmpty(newName))
            {
                return BadRequest("New name cannot be null or empty.");
            }

            var examDto = await _examService.GetByIdAsync(id);
            if (examDto == null)
            {
                return NotFound();
            }
            string oldName = examDto.ExamNamePrefix;
            examDto.ExamName = newName;
            var parts = oldName.Split("\\").ToList();

            if (parts.Any())
            {
                parts[parts.Count - 1] = newName;
                examDto.ExamNamePrefix = string.Join("\\", parts);
                examDto.ExamNamePrefix += examDto.ExamExtension;
            }
            var updatedExam = await _examService.UpdateExamAsync(id, examDto,oldName);

            return Ok(updatedExam);
        }
       

        // DELETE api/<ExamController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<int>> Delete(int id)
        {
         
            ExamDto exam=await _examService.GetByIdAsync(id);
            try
            {           
             
                await _examService.DeleteExamAsync(exam);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting file: {ex.Message}");
            }

            return Ok(id);
        }

        // GET api/<ExamController>/download/{filename}
        [HttpGet("download")]
        public async Task<IActionResult> Download(string fileNamePrefix)
        {
            
            if (string.IsNullOrEmpty(fileNamePrefix))
            {
                return BadRequest("File name cannot be null or empty.");
            }

            try
            {
              
                var fileStream = await _storageService.DownloadFileAsync(fileNamePrefix);
                if (fileStream == null)
                {
                    return NotFound("File not found.");
                }

                var contentType = "image/png";

                var fileName = Path.GetFileName(fileNamePrefix);
                Response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}");
                return File(fileStream, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error downloading file: {ex.Message}");
            }
        }
    }
}