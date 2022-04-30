using System;
using System.Linq;
using System.Reflection;
using System.Threading;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using NSubstitute;
using Xunit;

using gibbr.API.BackgroundService;
using gibbr.API.Infrastructure;
using gibbr.API.SignalR;
using gibbr.Domain;
using gibbr.Service;

namespace gibbr.Test.BackgroundService
{
    public class UpdateBoardBackgroundServiceTest
    {
        private readonly UpdateBoardBackgroundService _updateBoardBackgroundService;
        private readonly IBoardService _boardService;
        private readonly IBoardHubClientManager _boardHubClientManager;

        public UpdateBoardBackgroundServiceTest()
        {
            var logger = Substitute.For<ILogger<UpdateBoardBackgroundService>>();
            var configuration = Substitute.For<IConfiguration>();
            var serviceProvider = Substitute.For<IServiceProvider>();
            var setBoardCellQueue = Substitute.For<ISetBoardCellQueue>();
            _boardHubClientManager = Substitute.For<IBoardHubClientManager>();


            var serviceScopeFactory = Substitute.For<IServiceScopeFactory>();
            var serviceScope = Substitute.For<IServiceScope>();
            serviceProvider.GetService(typeof(IServiceScopeFactory)).Returns(serviceScopeFactory);
            serviceProvider.GetService<IServiceScopeFactory>().Returns(serviceScopeFactory);
            serviceProvider.GetRequiredService(typeof(IServiceScopeFactory)).Returns(serviceScopeFactory);
            serviceProvider.GetRequiredService<IServiceScopeFactory>().Returns(serviceScopeFactory);
            serviceProvider.CreateScope().Returns(serviceScope);
            serviceScope.ServiceProvider.Returns(serviceProvider);


            _boardService = Substitute.For<IBoardService>();
            serviceScope.ServiceProvider.GetService<IBoardService>().Returns(_boardService);
            serviceScope.ServiceProvider.GetRequiredService<IBoardService>().Returns(_boardService);

            _updateBoardBackgroundService = new UpdateBoardBackgroundService(logger, configuration, serviceProvider, setBoardCellQueue, _boardHubClientManager);
        }

        [Fact]
        public void SetBoardCell_Success()
        {
            //Setup
            Type type = typeof(UpdateBoardBackgroundService);
            var method = type.GetMethods(BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Instance)
                .FirstOrDefault(x => x.Name == "SetBoardCell");
            _boardService.SetBoardCellAsync(Arg.Any<BoardCellDTO>()).Returns(true);
            var boardCell = new BoardCellDTO()
            {
                X = 1,
                Y = 2,
                Letter = "T",
                UserId = "SetBoardCell_Success"
            };

            //Act
            method?.Invoke(_updateBoardBackgroundService, new object[] { boardCell, new CancellationToken() });

            //Assert
            _boardHubClientManager.Received().SendUpdateAsync(Arg.Is<BoardCellDTO>(_ => _ == boardCell), Arg.Any<CancellationToken>());
        }

        [Fact]
        public void SetBoardCell_NonSuccess()
        {
            //Setup
            Type type = typeof(UpdateBoardBackgroundService);
            var method = type.GetMethods(BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Instance)
                .FirstOrDefault(x => x.Name == "SetBoardCell");
            _boardService.SetBoardCellAsync(Arg.Any<BoardCellDTO>()).Returns(false);

            //Act
            method?.Invoke(_updateBoardBackgroundService, new object[] { new BoardCellDTO(), new CancellationToken() });

            //Assert
            _boardHubClientManager.DidNotReceive().SendUpdateAsync(Arg.Any<BoardCellDTO>(), Arg.Any<CancellationToken>());
        }
    }
}
