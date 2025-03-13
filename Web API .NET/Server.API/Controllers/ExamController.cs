using AutoMapper;
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
        private readonly IExamService _examService;
        readonly IMapper _mapper;

        public ExamController(IExamService examService,IMapper mapper)
        {
            _examService = examService;
            _mapper = mapper;
        }

        // GET: api/<ExamController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exam>>> Get()
        {
           
            List<Exam> exams =await _examService.GetAllExamsAsync();
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
        [HttpPost]
        public async Task<ActionResult<Exam>> Post([FromBody] ExamPostModel examPostModel)
        {
            if (examPostModel == null)
            {
                return BadRequest("Exam cannot be null");
            }
            ExamDto examDto = _mapper.Map<ExamDto>(examPostModel);
            examDto =await  _examService.AddExamAsync(examDto);
            if (examDto == null)
            {
                return BadRequest("Added failed");
            }
            return CreatedAtAction(nameof(Get), new { id = examDto.Id }, examDto);
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

        // DELETE api/<ExamController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {

            ExamDto examDto = await _examService.GetByIdAsync(id);
            if (examDto == null)
            {
                return NotFound();
            }
           await _examService.DeleteExamAsync(examDto);
            return NoContent();
        }
    }
}
