using Server.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.DTOs
{
    public class ExamDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TopicId { get; set; }
        public int GradeId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? TeacherId { get; set; }
    }
}
