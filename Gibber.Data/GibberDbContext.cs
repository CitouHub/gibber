using Gibber.Data.ComplexModel;
using Microsoft.EntityFrameworkCore;

namespace Gibber.Data
{
    public partial class GibberDbContext : BaseDbContext
    {
        public GibberDbContext()
        {
        }

        public GibberDbContext(DbContextOptions<BaseDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<sp_getBoardCells_Result> sp_getBoardCells_Result { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Latin1_General_CI_AS");

            modelBuilder.Entity<sp_getBoardCells_Result>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.X).HasColumnType("bigint");
                entity.Property(e => e.Y).HasColumnType("bigint");
                entity.Property(e => e.Letter).HasColumnType("char");
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
