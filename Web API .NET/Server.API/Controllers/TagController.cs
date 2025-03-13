using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Server.API.PostModel; // ודא שיש לך את המודל המתאים
using Server.Core.DTOs; // ודא שיש לך את ה-DTO המתאים
using Server.Core.Entities;
using Server.Core.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagService _tagService;
        private readonly IMapper _mapper;

        public TagController(ITagService tagService, IMapper mapper)
        {
            _tagService = tagService;
            _mapper = mapper;
        }

        // GET: api/<TagController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> Get()
        {
            List<Tag> tags = await _tagService.GetAllTagsAsync();
            if (tags == null)
            {
                return NotFound();
            }
            var tagDtos = _mapper.Map<List<TagDto>>(tags);
            return Ok(tagDtos);
        }

        // GET api/<TagController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> Get(int id)
        {
            TagDto tag = await _tagService.GetByIdAsync(id);
            if (tag == null)
            {
                return NotFound();
            }
            var tagDto = _mapper.Map<TagDto>(tag);
            return Ok(tagDto);
        }

        // POST api/<TagController>
        [HttpPost]
        public async Task<ActionResult<TagDto>> Post([FromBody] TagPostModel tagPostModel)
        {
            if (tagPostModel == null)
            {
                return BadRequest("Tag cannot be null");
            }
            var tagDto = _mapper.Map<TagDto>(tagPostModel);
            tagDto = await _tagService.AddTagAsync(tagDto);
            if (tagDto == null)
            {
                return BadRequest("Added failed");
            }
            return CreatedAtAction(nameof(Get), new { id = tagDto.Id }, tagDto);
        }

        // PUT api/<TagController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TagDto>> Put(int id, [FromBody] TagPostModel tagPostModel)
        {
            if (tagPostModel == null)
            {
                return BadRequest("Tag cannot be null");
            }
            var tagDto = _mapper.Map<TagDto>(tagPostModel);
            tagDto = await _tagService.UpdateTagAsync(id, tagDto);
            if (tagDto == null)
            {
                return NotFound();
            }
            return Ok(tagDto);
        }

        // DELETE api/<TagController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            TagDto tag = await _tagService.GetByIdAsync(id);
            if (tag == null)
            {
                return NotFound();
            }
            await _tagService.DeleteTagAsync(tag);
            return NoContent();
        }
    }
}
