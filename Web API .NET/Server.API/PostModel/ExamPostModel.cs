using Server.Core.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.API.PostModel
{
    public class ExamPostModel
    {

        public string examName { get; set; }

        public string examPath { get; set; }

        public int UsertId { get; set; }
        
        public int TopicId { get; set; }

        //public int GradeId { get; set; }

        public int? TeacherId { get; set; }

        public List<Tag> Tags { get; set; }
    }
}
