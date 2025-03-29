namespace Server.Core.DTOs
{
    public class ExamDto
    {
        public int Id { get; set; } 
        public int UserId { get; set; } 
        public string ExamName { get; set; }
      

        //public string UniqueFileName { get; set; }
        public string ExamType { get; set; }
        public string ExamExtension { get; set; } 
        public long Size { get; set; } 
        public int TopicId { get; set; } 
        public int? FolderId { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; } 
        public bool IsDeleted { get; set; }
        public bool IsShared { get; set; }
        public string ExamPath { get; set; } 
        public List<string> Tags { get; set; } 
    }
}
