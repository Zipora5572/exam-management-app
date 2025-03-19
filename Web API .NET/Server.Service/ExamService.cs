using AutoMapper;
using Server.Core.DTOs;

using Server.Core.Entities;
using Server.Core.IRepositories;
using Server.Core.IServices;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Service
{
    public class ExamService : IExamService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public ExamService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<List<Exam>> GetAllExamsAsync()
        {
            
            var exams = await _repositoryManager.Exams.GetAllAsync();
            return exams.ToList();
        }

        public async Task<ExamDto> GetByIdAsync(int id)
        {
            Exam exam = await _repositoryManager.Exams.GetByIdAsync(id);
            ExamDto examDto = _mapper.Map<ExamDto>(exam);
            return examDto;
        }

        public async Task<ExamDto> AddExamAsync(ExamDto examDto)
        {
            Exam exam = _mapper.Map<Exam>(examDto);
            exam = await _repositoryManager.Exams.AddAsync(exam);
            await _repositoryManager.SaveAsync();
            examDto = _mapper.Map<ExamDto>(exam);
            return examDto;
        }

        public async Task DeleteExamAsync(ExamDto examDto)
        {
            Exam exam = _mapper.Map<Exam>(examDto);
           await _repositoryManager.Exams.DeleteAsync(exam);
            await _repositoryManager.SaveAsync();
        }

        public async Task<ExamDto> UpdateExamAsync(int id, ExamDto examDto)
        {
            Exam exam = _mapper.Map<Exam>(examDto);
            exam = await _repositoryManager.Exams.UpdateAsync(id, exam);
            await _repositoryManager.SaveAsync();
            examDto = _mapper.Map<ExamDto>(exam);
            return examDto;
        }
    }
}
