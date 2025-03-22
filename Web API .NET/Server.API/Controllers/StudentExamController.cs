using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Server.API.PostModel;
using Server.Core.DTOs;
using Server.Core.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentExamController : ControllerBase
    {
        private readonly IStudentExamService _studentExamService;
        private readonly IMapper _mapper;

        public StudentExamController(IStudentExamService studentExamService, IMapper mapper)
        {
            _studentExamService = studentExamService;
            _mapper = mapper;
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
