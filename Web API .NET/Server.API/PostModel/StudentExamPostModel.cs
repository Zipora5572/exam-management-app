﻿using Server.Core.DTOs;
using Server.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace Server.API.PostModel
{
    public class StudentExamPostModel
    {

        public int ExamId { get; set; }

        public int StudentId { get; set; }
        public string? ExamPath { get; set; }
        public string? StudentExamName { get; set; }
        public string? ExamNamePrefix { get; set; }

        public int ?FolderId { get; set; }
        public int TeacherId { get; set; }

        public bool IsChecked { get; set; } = false;

        public int? score { get; set; }

        public string? teacherComments { get; set; }

        

        public List<IFormFile> Files { get; set; } = new List<IFormFile>();
 
    }
}
