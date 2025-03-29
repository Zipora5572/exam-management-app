using Server.Core.DTOs;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Core.Entities
{
    public class StudentExam
    {
        public int Id { get; set; }

        public int ExamId { get; set; }
        public Exam Exam { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; }
        public string ExamPath { get; set; }
        public string StudentExamName { get; set; }
        public string ExamNamePrefix { get; set; }
        public int FolderId { get; set; }
        public Folder Folder { get; set; }
        public int TeacherId { get; set; }
        public User Teacher { get; set; }

        public bool IsChecked { get; set; }
        public int? Score { get; set; }
        public string? TeacherComments { get; set; }
        public DateTime? CheckedAt { get; set; }
    }
}
