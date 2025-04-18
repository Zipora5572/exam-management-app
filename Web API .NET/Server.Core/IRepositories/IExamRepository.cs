﻿using Server.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.IRepositories
{
    public interface IExamRepository:IRepository<Exam>
    {
        IQueryable<Exam> GetAllExams();
    }
}
