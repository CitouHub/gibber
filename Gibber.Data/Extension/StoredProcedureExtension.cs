using Microsoft.EntityFrameworkCore;
using Gibber.Data.ComplexModel;
using Gibber.Data.TypeModel;

#pragma warning disable IDE1006 // Naming Styles
namespace Gibber.Data.Extension
{
    public static class StoredProcedureExtension
    {
        public static async Task<List<sp_getBoardCells_Result>> sp_getBoardCellsAsync(this GibberDbContext context, long x, long y, short dx, short dy)
        {
            var expr = $"exec sp_getBoardCells {x}, {y}, {dx}, {dy}";

            return await context.Set<sp_getBoardCells_Result>().FromSqlRaw(expr).ToListAsync();
        }

        public static async Task<short> sp_getBoardCellStateAsync(this GibberDbContext context, long x, long y, string? userId)
        {
            var expr = $"exec sp_getBoardCellState {x}, {y}, '{userId}'";

            var result = (await context.Set<ShortResult>().FromSqlRaw(expr).ToArrayAsync())?.FirstOrDefault()?.Result;
            return result ?? -1;
        }

        public static async Task<bool> sp_addBoardCellAsync(this GibberDbContext context, long x, long y, string? userId, string? letter)
        {
            var expr = $"exec sp_addBoardCell {x}, {y}, '{userId}', '{Escape(letter)}{letter}'";

            var result = (await context.Set<BoolResult>().FromSqlRaw(expr).ToArrayAsync())?.FirstOrDefault()?.Result;
            return result ?? false;
        }

        public static async Task<bool> sp_updateBoardCellAsync(this GibberDbContext context, long x, long y, string? letter)
        {
            var expr = $"exec sp_updateBoardCell {x}, {y}, '{Escape(letter)}{letter}'".ToString();

            var result = (await context.Set<BoolResult>().FromSqlRaw(expr).ToArrayAsync())?.FirstOrDefault()?.Result;
            return result ?? false;
        }

        private static string Escape(string? letter)
        {
            if(letter is not null)
            {
                if(letter == "\'")
                {
                    return "\'";
                }
                if (letter == "{")
                {
                    return "{";
                }
                if (letter == "}")
                {
                    return "}";
                }
            }

            return "";
        }
    }
}
