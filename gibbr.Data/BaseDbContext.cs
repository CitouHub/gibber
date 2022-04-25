using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace gibbr.Data
{
    public partial class BaseDbContext : DbContext
    {
        public BaseDbContext()
        {
        }

        public BaseDbContext(DbContextOptions<BaseDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BoardCell> BoardCells { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS02;Initial Catalog=Gibbr;persist security info=True;Integrated Security=SSPI;MultipleActiveResultSets=True");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BoardCell>(entity =>
            {
                entity.HasKey(e => new { e.X, e.Y })
                    .HasName("BoardCell_PK");

                entity.ToTable("BoardCell");

                entity.Property(e => e.Background).HasMaxLength(10);

                entity.Property(e => e.Color).HasMaxLength(10);

                entity.Property(e => e.InsertDate).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Letter)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.UserId).HasMaxLength(50);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
