using Server.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Server.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly IDataContext _context;

        public IUserRepository Users { get; }
        public IExamRepository Exams { get; }
        //public IGradeRepository Grades { get; }
        //public IInstitutionRepository Institutions { get; }
        public IPermissionRepository Permissions { get; }
        public IRoleRepository Roles { get; }
        public ITagRepository Tags { get; }
        public ITopicRepository Topics { get; }

       

        public RepositoryManager(
            IDataContext context,
            IUserRepository userRepository,
            IExamRepository examRepository,
            //IGradeRepository gradeRepository,
            //IInstitutionRepository institutionRepository,
            IPermissionRepository permissionRepository,
            IRoleRepository roleRepository,
            ITagRepository tagRepository,
            ITopicRepository topicRepository)
        {
            _context = context;
            Users = userRepository;
            Exams = examRepository;
            //Grades = gradeRepository;
            //Institutions = institutionRepository;
            Permissions = permissionRepository;
            Roles = roleRepository;
            Tags = tagRepository;
            Topics = topicRepository;
        }

        public async Task SaveAsync()
        {
           await _context.SaveChangesAsync();
        }
    }
}
