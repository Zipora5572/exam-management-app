﻿using Server.Core.DTOs;
using Server.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Core.IServices
{
    public interface IExamService
    {
        Task<List<Exam>> GetAllExamsAsync();
        Task<ExamDto> GetByIdAsync(int id);
        Task<ExamDto> AddExamAsync(ExamDto exam);
        Task DeleteExamAsync(ExamDto exam);
        Task<ExamDto> UpdateExamAsync(int id, ExamDto exam,string oldName="");
    }
}
