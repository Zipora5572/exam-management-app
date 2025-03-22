// Source: StudentExamService.cs
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
    public class StudentExamService : IStudentExamService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public StudentExamService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<List<StudentExamDto>> GetAllStudentExamsAsync()
        {
            var studentExams = await _repositoryManager.StudentExams.GetAllAsync();
            return studentExams.Select(exam => _mapper.Map<StudentExamDto>(exam)).ToList();
        }

        public async Task<StudentExamDto> GetByIdAsync(int id)
        {
            StudentExam studentExam = await _repositoryManager.StudentExams.GetByIdAsync(id);
            return _mapper.Map<StudentExamDto>(studentExam);
        }
        public async Task<List<StudentExamDto>> GetStudentExamsByExamIdAsync(int examId)
        {
            var studentExams = await _repositoryManager.StudentExams.GetByExamIdAsync(examId);
            return studentExams.Select(exam => _mapper.Map<StudentExamDto>(exam)).ToList();
        }

        public async Task<StudentExamDto> AddStudentExamAsync(StudentExamDto studentExamDto)
        {
            StudentExam studentExam = _mapper.Map<StudentExam>(studentExamDto);
            studentExam = await _repositoryManager.StudentExams.AddAsync(studentExam);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<StudentExamDto>(studentExam);
        }

        public async Task<StudentExamDto> UpdateStudentExamAsync(int id, StudentExamDto studentExamDto)
        {
            StudentExam studentExam = _mapper.Map<StudentExam>(studentExamDto);
            studentExam = await _repositoryManager.StudentExams.UpdateAsync(id, studentExam);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<StudentExamDto>(studentExam);
        }

        public async Task DeleteStudentExamAsync(StudentExamDto studentExamDto)
        {
            StudentExam studentExam = _mapper.Map<StudentExam>(studentExamDto);
            await _repositoryManager.StudentExams.DeleteAsync(studentExam);
            await _repositoryManager.SaveAsync();
        }
    }
}
