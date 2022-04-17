using Gibber.API.Infrastructure;
using Gibber.Service;

namespace Gibber.API.BackgroundService
{
    public class UpdateBoardBackgroundService : IHostedService
    {
        private readonly ILogger<UpdateBoardBackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly IAddBoardCellQueue _addBoardCellQueue;

        public UpdateBoardBackgroundService(
            ILogger<UpdateBoardBackgroundService> logger,
            IServiceProvider serviceProvider,
            IAddBoardCellQueue addBoardCellQueue)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _addBoardCellQueue = addBoardCellQueue;
            _logger.LogDebug("Instantiated");
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _ = AddBoardCells(cancellationToken);
            return Task.CompletedTask;
        }

        public async Task AddBoardCells(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                _logger.LogInformation($"Waiting for trade rule test request...");
                var boardCell = await _addBoardCellQueue.DequeueAsync(cancellationToken);

                if (boardCell != null && cancellationToken.IsCancellationRequested == false)
                {
                    using (IServiceScope outerScope = _serviceProvider.CreateScope())
                    {
                        var boardService = outerScope.ServiceProvider.GetRequiredService<IBoardService>();
                        var added = await boardService.AddBoardCellAsync(boardCell);
                    }
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
