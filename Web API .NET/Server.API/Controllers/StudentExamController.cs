using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Server.API.PostModel;
using Server.Core.DTOs;
using Server.Core.IServices;
using Server.Service;
using System.Collections.Generic;
using System.IO;
using System.Security.AccessControl;
using System.Threading.Tasks;

namespace Server.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentExamController : ControllerBase
    {
        private readonly IStudentExamService _studentExamService;
        private readonly IMapper _mapper;
        private readonly IStorageService _storageService;
        private readonly IExamService _examService;
        private readonly IFolderService _folderService;

        public StudentExamController(IStudentExamService studentExamService, IMapper mapper, IStorageService storageService, IExamService examService, IFolderService folderService)
        {
            _studentExamService = studentExamService;
            _mapper = mapper;
            _storageService = storageService;
            _examService = examService;
            _folderService = folderService;
        }

        // GET: api/<StudentExamController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentExamDto>>> Get()
        {
            List<StudentExamDto> studentExams = await _studentExamService.GetAllStudentExamsAsync();
            return Ok(studentExams);
        }

        // GET api/<StudentExamController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentExamDto>> Get(int id)
        {
            StudentExamDto studentExam = await _studentExamService.GetByIdAsync(id);
            if (studentExam == null)
            {
                return NotFound();
            }
            return Ok(studentExam);
        }
        // GET api/<StudentExamController>/exam/{examId}
        [HttpGet("exam/{examId}")]
        public async Task<ActionResult<IEnumerable<StudentExamDto>>> GetByExamId(int examId)
        {
            var studentExams = await _studentExamService.GetStudentExamsByExamIdAsync(examId);

            if (studentExams == null || !studentExams.Any())
            {
                return NotFound();
            }

            return Ok(studentExams);
        }

        [HttpPost("uploadStudentExam")]
        public async Task<ActionResult> UploadStudentExam([FromForm] StudentExamPostModel studentExamPostModel)
        {
            if (studentExamPostModel.Files == null || studentExamPostModel.Files.Count == 0)
            {
                return BadRequest("No files uploaded.");
            }

            var exam = await _examService.GetByIdAsync(studentExamPostModel.ExamId);
            if (exam == null)
            {
                return NotFound("Exam not found.");
            }

            var teacherExamFolder = exam.ExamName;
            string folderName = Path.GetDirectoryName(studentExamPostModel.Files[0].FileName);
            var studentExams = new List<StudentExamDto>();
            FolderDto folderDto = new FolderDto();
            folderDto.FolderName = folderName;
            folderDto.UserId = exam.UserId;
            folderDto.OfTeacherExams = false;
            folderDto.FolderNamePrefix = folderName;
          
            FolderDto addedFolder = await _folderService.AddFolderAsync(folderDto);
            int id = addedFolder.Id;
          

            var uploadTasks = studentExamPostModel.Files.Select(file =>
            {
                string fileName = Path.GetFileName(file.FileName);


                var objectName = $"{teacherExamFolder}/{fileName}";
                var filePath = Path.Combine(Path.GetTempPath(), fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }


                return _storageService.UploadFileAsync(filePath, objectName);
            }).ToList();

            await Task.WhenAll(uploadTasks);
         
            foreach (var file in studentExamPostModel.Files)
            {
                var objectName = $"{teacherExamFolder}/{Path.GetFileName(file.FileName)}";
                var studentExamDto = _mapper.Map<StudentExamDto>(studentExamPostModel);
                studentExamDto.ExamPath = $"https://storage.cloud.google.com/exams-bucket/{objectName}";
                studentExamDto.StudentExamName = Path.GetFileNameWithoutExtension(file.FileName);
                studentExamDto.ExamNamePrefix = objectName;



                studentExamDto.FolderId = id;
                Console.WriteLine("ID"+ studentExamDto.FolderId );
               

                var savedStudentExam = await _studentExamService.AddStudentExamAsync(studentExamDto);
                studentExams.Add(savedStudentExam);


                var filePath = Path.Combine(Path.GetTempPath(), Path.GetFileName(file.FileName));
                System.IO.File.Delete(filePath);
            }

            return Ok(new { message = "Files uploaded successfully.", studentExams });
        }



        // POST api/<StudentExamController>
        [HttpPost]
        public async Task<ActionResult<StudentExamDto>> Post([FromBody] StudentExamPostModel studentExamPostModel)
        {
            if (studentExamPostModel == null)
            {
                return BadRequest("StudentExam cannot be null");
            }
            var studentExamDto = _mapper.Map<StudentExamDto>(studentExamPostModel);
            studentExamDto = await _studentExamService.AddStudentExamAsync(studentExamDto);
            return CreatedAtAction(nameof(Get), new { id = studentExamDto.Id }, studentExamDto);
        }

        // PUT api/<StudentExamController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<StudentExamDto>> Put(int id, [FromBody] StudentExamPostModel studentExamPostModel)
        {
            
            if (studentExamPostModel == null)
            {
                return BadRequest("StudentExam cannot be null");
            }

            var existingStudentExamDto = await _studentExamService.GetByIdAsync(id);
            if (existingStudentExamDto == null)
            {
                return NotFound();
            }

            var updatedStudentExamDto = _mapper.Map<StudentExamDto>(studentExamPostModel);


            updatedStudentExamDto.Id = id; // Ensure the ID is set for the update
            updatedStudentExamDto.CheckedAt = DateTime.Now;
            updatedStudentExamDto.IsChecked = true;

            updatedStudentExamDto = await _studentExamService.UpdateStudentExamAsync(id, updatedStudentExamDto);
            return Ok(updatedStudentExamDto);
        }

        // DELETE api/<StudentExamController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var studentExam = await _studentExamService.GetByIdAsync(id);
            if (studentExam == null)
            {
                return NotFound();
            }
            await _studentExamService.DeleteStudentExamAsync(studentExam);
            return NoContent();
        }
    }
}
