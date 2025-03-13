using Server.Core.DTOs;
using Server.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.IServices
{
    public interface ITagService
    {
        Task<List<Tag>> GetAllTagsAsync();
        Task<TagDto> GetByIdAsync(int id);
        Task<TagDto> AddTagAsync(TagDto tag);
        Task DeleteTagAsync(TagDto tag);
        Task<TagDto> UpdateTagAsync(int id, TagDto tag);
    }
}
