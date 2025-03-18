using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Entities
{
    public class Exam
    {
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User User { get; set; }


        public string ExamName { get; set; }

        public string ExamType { get; set; }
        public string ExamExtension { get; set; }

        public long Size { get; set; }

        [ForeignKey(nameof(Topic))]
        public int TopicId { get; set; }
        public Topic Topic { get; set; }

        [ForeignKey(nameof(Folder))]
        public int? FolderId { get; set; }
        public Folder? Folder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; }


        public string ExamPath { get; set; }

        public List<Tag> Tags { get; set; }
       
    }
}
