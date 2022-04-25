using gibbr.Data.ComplexModel;
using gibbr.Data.TypeModel;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8618
#pragma warning disable IDE1006 
namespace gibbr.Data
{
    public partial class GibbrDbContext : BaseDbContext
    {
        public GibbrDbContext()
        {
        }

        public GibbrDbContext(DbContextOptions<BaseDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<sp_getBoardCells_Result> sp_getBoardCells_Result { get; set; }
        public virtual DbSet<BoolResult> BoolResult { get; set; }
        public virtual DbSet<ShortResult> ShortResult { get; set; }
        public virtual DbSet<VoidResult> VoidResult { get; set; }

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
                entity.Property(e => e.UserId).HasMaxLength(50);
            });

            modelBuilder.Entity<BoolResult>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Result).HasColumnType("bit");
            });

            modelBuilder.Entity<ShortResult>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Result).HasColumnType("tinyint");
            });

            modelBuilder.Entity<VoidResult>(entity =>
            {
                entity.HasNoKey();
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
