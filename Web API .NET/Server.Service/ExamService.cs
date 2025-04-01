using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
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
        private readonly IStorageService _storageService;
        private readonly IMapper _mapper;
       


        public ExamService(IRepositoryManager repositoryManager, IMapper mapper, IStorageService storageService)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _storageService = storageService;

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
            var existingExam = await _repositoryManager.Exams.GetByIdAsync(examDto.Id);
            if (existingExam != null)
            {
               await  _repositoryManager.Exams.DeleteAsync(existingExam);
                await _storageService.DeleteFileAsync(examDto.ExamNamePrefix );
                await _repositoryManager.SaveAsync();
            }
            else
            {
                throw new InvalidOperationException("Exam not found.");
            }
        }

        public async Task<ExamDto> UpdateExamAsync(int id, ExamDto examDto, string oldName = "")
        {
            Exam exam = _mapper.Map<Exam>(examDto);
           
            exam = await _repositoryManager.Exams.UpdateAsync(id, exam);
            Console.WriteLine();
           
            if (!string.IsNullOrEmpty(oldName))
            {

                string folderPath = Path.GetDirectoryName(oldName);
           
                string newFileName = examDto.ExamName +examDto.ExamExtension;
              

                string newFilePath = Path.Combine(folderPath, newFileName);

                await _storageService.RenameFileAsync(oldName, newFilePath);
            }

            await _repositoryManager.SaveAsync();
            examDto = _mapper.Map<ExamDto>(exam);
            return examDto;
        }

    }
}
