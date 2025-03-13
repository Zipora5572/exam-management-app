using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.IRepositories
{
    public interface IRepositoryManager
    {
        IUserRepository Users { get; }
        IExamRepository Exams { get; }
        IRoleRepository Roles { get; }
        IPermissionRepository Permissions { get; }
        //IGradeRepository Grades { get; }
        ITagRepository Tags { get; }
        ITopicRepository Topics { get; }
        //IInstitutionRepository Institutions { get; }

       Task SaveAsync();
    }
}
