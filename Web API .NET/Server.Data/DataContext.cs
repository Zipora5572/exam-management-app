using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Server.Core.Entities;


namespace Server.Data
{
    public class DataContext : DbContext, IDataContext
    {
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Folder> Folders { get; set; }
        //public DbSet<Grade> Grades { get; set; }
        //public DbSet<Institution> Institutions { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<User> Users { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public virtual EntityEntry Entry(object entity)
        {
            return base.Entry(entity);
        }
        public async Task<int> SaveChangesAsync() 
        {
            return await base.SaveChangesAsync();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Folder>()
                .HasOne(f => f.ParentFolder)
                .WithMany()
                .HasForeignKey(f => f.ParentFolderId)
                .OnDelete(DeleteBehavior.Restrict); // או DeleteBehavior.SetNull

            modelBuilder.Entity<Folder>().HasQueryFilter(f => !f.IsDeleted);
        }
       

    }
}
