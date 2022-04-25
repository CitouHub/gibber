using gibbr.API.Infrastructure;
using gibbr.API.SignalR;
using gibbr.Domain;
using gibbr.Service;

namespace gibbr.API.BackgroundService
{
    public class UpdateBoardBackgroundService : IHostedService
    {
        private readonly ILogger<UpdateBoardBackgroundService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;
        private readonly ISetBoardCellQueue _setBoardCellQueue;
        private readonly IBoardHubClientManager _boardHubClientManager;
        private readonly List<Task> _setBoardCellTasks;

        public UpdateBoardBackgroundService(
            ILogger<UpdateBoardBackgroundService> logger,
            IConfiguration configuration,
            IServiceProvider serviceProvider,
            ISetBoardCellQueue setBoardCellQueue,
            IBoardHubClientManager boardHubClientManager)
        {
            _logger = logger;
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            _setBoardCellQueue = setBoardCellQueue;
            _boardHubClientManager = boardHubClientManager;
            _setBoardCellTasks = new List<Task>();
            _logger.LogDebug("Instantiated");
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _ = SetBoardCells(cancellationToken);
            return Task.CompletedTask;
        }

        private async Task SetBoardCells(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                _logger.LogDebug($"Waiting for set board cell request...");
                var boardCell = await _setBoardCellQueue.DequeueAsync(cancellationToken);

                _logger.LogDebug($"Waiting for set board cell task slot...");
                AwaitTaskSlot(cancellationToken);
                _logger.LogDebug($"Set board cell task slot granted...");

                if (boardCell != null && cancellationToken.IsCancellationRequested == false)
                {
                    _setBoardCellTasks.Add(SetBoardCell(boardCell, cancellationToken));
                }
            }
        }

        private async Task SetBoardCell(BoardCellDTO boardCell, CancellationToken cancellationToken)
        {
            _logger.LogDebug($"New set board cell task started for {boardCell}, {_setBoardCellTasks.Count} tasks running");
            using IServiceScope outerScope = _serviceProvider.CreateScope();
            var boardService = outerScope.ServiceProvider.GetRequiredService<IBoardService>();
            var success = await boardService.SetBoardCellAsync(boardCell);
            if(success)
            {
                var messagesSent = await _boardHubClientManager.SendUpdateAsync(boardCell, cancellationToken);
                _logger.LogDebug($"Board cell successfully update and updates sent to {messagesSent} subscribing clients");
            } 
            else
            {
                _logger.LogDebug($"Board cell could not be updated");
            }
        }

        private void AwaitTaskSlot(CancellationToken cancellationToken)
        {
            var maxConcurrentTasks = _configuration.GetValue<short>("MaxConcurrentTasks");
            RemoveFinishedTasks();

            if (_setBoardCellTasks.Count >= maxConcurrentTasks)
            {
                _logger.LogDebug($"All set board cell task slots busy");
                Task.WaitAny(_setBoardCellTasks.ToArray(), cancellationToken);
                RemoveFinishedTasks();
            }
        }

        private void RemoveFinishedTasks()
        {
            var finishedTasks = _setBoardCellTasks.Where(_ => _.IsCompleted).ToList();
            finishedTasks.ForEach(_ => _setBoardCellTasks.Remove(_));
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
