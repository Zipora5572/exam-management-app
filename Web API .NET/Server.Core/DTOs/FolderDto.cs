using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.DTOs
{
    public class FolderDto
    {
        public int Id { get; set; } 
        public int UserId { get; set; } 
        public string FolderName { get; set; } 
        public int? ParentFolderId { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; } 
        public bool IsDeleted { get; set; } 

    }
}
