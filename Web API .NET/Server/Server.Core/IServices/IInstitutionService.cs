using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.IServices
{
    public interface IInstitutionService
    {
        List<string> GetAllInstitutions();
        string GetById(int id);
        string AddInstitution(string institutionName);
        void DeleteInstitution(string institutionName);
        string UpdateInstitution(int id, string institutionName);
    }
}