﻿using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Core.IRepositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();

        Task<T?> GetByIdAsync(int id);

        Task<T> AddAsync(T entity);

        Task<T> UpdateAsync(int id, T entity);

        Task DeleteAsync(T entity);
    }
}
