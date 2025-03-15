using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
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

        public string examName { get; set; }

        [ForeignKey(nameof(Topic))]
        public int TopicId { get; set; }

        public Topic Topic { get; set; }
        public int GradeId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? TeacherId { get; set; }


        public string examPath { get; set; }
        public List<Tag> Tags { get; set; }
       
    }
}
