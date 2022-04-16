using Microsoft.EntityFrameworkCore;
using Gibber.Data.ComplexModel;

namespace Gibber.Data.Extension
{
    public static class StoredProcedureExtension
    {
        public static async Task<List<sp_getBoardCells_Result>> sp_getBoardCells(this GibberDbContext context, long x, long y, short dx, short dy)
        {
            var expr = $"exec sp_getBoardCells {x}, {y}, {dx}, {dy}";

            return await context.Set<sp_getBoardCells_Result>().FromSqlRaw(expr).ToListAsync();
        }
    }
}
