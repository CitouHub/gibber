using Microsoft.Data.SqlClient;

using gibbr.API.Util;
using gibbr.Common;

namespace gibbr.API.BackgroundService
{
    public class DatabaseMigrationBackgroundService : IHostedService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<DatabaseMigrationBackgroundService> _logger;

        public DatabaseMigrationBackgroundService(
            ILogger<DatabaseMigrationBackgroundService> logger,
            IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _logger.LogDebug("Instantiated");
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await UpdateTitleScreen(cancellationToken);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private async Task UpdateTitleScreen(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Running database migration");
            var titleScreen =
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                "............................@@@....@@@...........@@@...................................\n" +
                "............................@@@....@@@...........@@@...................................\n" +
                "...................................@@@...........@@@...................................\n" +
                "...................................@@@...........@@@...................................\n" +
                "...............@@@@@@@@.....@@@....@@@@@@@@@.....@@@@@@@@@.....@@@.@@@@................\n" +
                "..............@@@@@@@@@@....@@@....@@@@@@@@@@....@@@@@@@@@@....@@@@@@@@@...............\n" +
                "..............@@@....@@@....@@@....@@@....@@@....@@@....@@@....@@@@....................\n" +
                "..............@@@....@@@....@@@....@@@....@@@....@@@....@@@....@@@.....................\n" +
                "..............@@@@@@@@@@....@@@....@@@@@@@@@@....@@@@@@@@@@....@@@.....................\n" +
                "...............@@@@@@@@@....@@@....@@@@@@@@@.....@@@@@@@@@.....@@@.....................\n" +
                ".....................@@@...............................................................\n" +
                ".....................@@@....Version: #.................................................\n" +
                "..............@@@@@@@@@@...............................................................\n" +
                "...............@@@@@@@@.....Welcome to the asciiverse of gibbr :)......................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".....1. Characters entered by you can only be changed or erased by you.................\n" +
                ".....2. Characters not entered by you can't be changed or erased by you................\n" +
                ".....3. Your characters must be one space away from characters not entered by you......\n" +
                ".....4. Use the mouse to drag yourself around..........................................\n" +
                ".....5. Use the mouse wheel to zoom in and out.........................................\n" +
                ".....6. Press CTRL+G to go to coordinates..............................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n" +
                ".......................................................................................\n";

            var connectionString = _configuration.GetValue<string>("ConnectionString");
            var connection = new SqlConnection(connectionString);
            await connection.OpenAsync(cancellationToken);

            long startX = -43;
            long startY = -23;
            long x = startX;
            long y = startY;

            long? versionX = null;
            long? versionY = null;

            //Set the landing page design
            foreach (var letter in titleScreen.ToCharArray())
            {
                if (letter == '\n')
                {
                    x = startX;
                    y++;
                }
                else
                {
                    var createCommand = new SqlCommand($"UPDATE BoardCell SET " +
                        $"Letter = \'{LetterFormat.Escape(letter.ToString())}{letter}\', " +
                        $"UserId = \'{Guid.NewGuid()}\' " +
                        $"WHERE X = {x} AND Y = {y}", connection);
                    await createCommand.ExecuteNonQueryAsync(cancellationToken);

                    if (letter == '#')
                    {
                        versionX = x;
                        versionY = y;
                    }

                    x++;
                }
            }

            //Insert the version, replace the '#' character

            var t = typeof(Program);
            var versionLetters = (t?.GetReleaseTag() + t?.GetFileVersion() + t?.GetAssemblyVersion() + t?.GetInformalVersion())?.ToCharArray();
            if (versionLetters is not null && versionX is not null && versionY is not null)
            {
                x = versionX.Value;
                foreach (var letter in versionLetters)
                {
                    var createCommand = new SqlCommand($"UPDATE BoardCell SET " +
                        $"Letter = \'{LetterFormat.Escape(letter.ToString())}{letter}\', " +
                        $"UserId = \'{Guid.NewGuid()}\' " +
                        $"WHERE X = {x} AND Y = {versionY.Value}", connection);
                    await createCommand.ExecuteNonQueryAsync(cancellationToken);
                    x++;
                }
            }

            await connection.CloseAsync();
        }
    }
}