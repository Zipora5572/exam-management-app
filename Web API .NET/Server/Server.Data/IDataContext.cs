using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Server.Core.Entities;
using System.Threading.Tasks;

namespace Server.Data
{
    public interface IDataContext
    {
        public DbSet<Exam> Exams { get; set; }
        //public DbSet<Grade> Grades { get; set; }
        //public DbSet<Institution> Institutions { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<User> Users { get; set; }
        Task<int> SaveChangesAsync(); 
        public EntityEntry Entry(object entity);
    }
}
