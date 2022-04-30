using gibbr.API.SignalR;
using gibbr.Common;
using gibbr.Domain;
using Microsoft.AspNetCore.SignalR;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace gibbr.Test.SignalR
{
    public class BoardHubClientManagerTest
    {
        private readonly BoardHubClientManager _boardHubClientManager;
        private readonly IHubContext<BoardHub> _hubContext = Substitute.For<IHubContext<BoardHub>>();

        public BoardHubClientManagerTest()
        {
            _boardHubClientManager = new BoardHubClientManager(_hubContext);
        }

        [Theory]
        [InlineData(-1, -1)]
        [InlineData(-1, 0)]
        [InlineData(-1, 1)]
        [InlineData(0, -1)]
        [InlineData(0, 1)]
        [InlineData(1, -1)]
        [InlineData(1, 0)]
        [InlineData(1, 1)]
        public void SendUpdate_NoSend_OutOfFrame(long x, long y)
        {
            //Setup
            var boardClient = new BoardClient()
            {
                X = x,
                Y = y,
                Dx = 0,
                Dy = 0,
                UserId = Guid.NewGuid().ToString(),
                ConnectionId = Guid.NewGuid().ToString(),
            };
            _boardHubClientManager.AddClient(boardClient);

            //Act
            var messagesSent = _boardHubClientManager.SendUpdateAsync(
                new BoardCellDTO() { X = 0, Y = 0, Letter = "T", UserId = Guid.NewGuid().ToString() },
                new CancellationToken()).Result;

            //Assert
            Assert.Equal(0, messagesSent);
            _hubContext.Clients
                .DidNotReceive().Client(Arg.Any<string>())
                .DidNotReceive().SendAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
        }

        [Fact]
        public void SendUpdate_NoSend_OwnBoardCell()
        {
            //Setup
            var boardClient = new BoardClient()
            {
                X = 0,
                Y = 0,
                Dx = 0,
                Dy = 0,
                UserId = Guid.NewGuid().ToString(),
                ConnectionId = Guid.NewGuid().ToString(),
            };
            _boardHubClientManager.AddClient(boardClient);

            //Act
            var messagesSent = _boardHubClientManager.SendUpdateAsync(
                new BoardCellDTO() { X = 0, Y = 0, Letter = "T", UserId = boardClient.UserId },
                new CancellationToken()).Result;

            //Assert
            Assert.Equal(0, messagesSent);
            _hubContext.Clients
                .DidNotReceive().Client(Arg.Any<string>())
                .DidNotReceive().SendAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
        }

        [Fact]
        public void SendUpdate_NoSend_ClientRemoved()
        {
            //Setup
            var boardClient = new BoardClient()
            {
                X = 0,
                Y = 0,
                Dx = 0,
                Dy = 0,
                UserId = Guid.NewGuid().ToString(),
                ConnectionId = Guid.NewGuid().ToString(),
            };
            _boardHubClientManager.AddClient(boardClient);
            _boardHubClientManager.RemoveClient(boardClient.UserId);

            //Act
            var messagesSent = _boardHubClientManager.SendUpdateAsync(
                new BoardCellDTO() { X = 0, Y = 0, Letter = "T", UserId = Guid.NewGuid().ToString() },
                new CancellationToken()).Result;

            //Assert
            Assert.Equal(0, messagesSent);
            _hubContext.Clients
                .DidNotReceive().Client(Arg.Any<string>())
                .DidNotReceive().SendAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
        }

        [Theory]
        [InlineData(-1, -1)]
        [InlineData(-1, 0)]
        [InlineData(0, -1)]
        [InlineData(0, 0)]
        public void SendUpdate_InFrame(long x, long y)
        {
            //Setup
            var boardClient = new BoardClient()
            {
                X = x,
                Y = y,
                Dx = 1,
                Dy = 1,
                UserId = Guid.NewGuid().ToString(),
                ConnectionId = Guid.NewGuid().ToString(),
            };
            _boardHubClientManager.AddClient(boardClient);
            var clientProxy = Substitute.For<IClientProxy>();
            _hubContext.Clients.Client(Arg.Is<string>(_ => _ == boardClient.ConnectionId))
                .Returns(clientProxy);

            //Act
            var messagesSent = _boardHubClientManager.SendUpdateAsync(
                new BoardCellDTO() { X = 0, Y = 0, Letter = "T", UserId = Guid.NewGuid().ToString() },
                new CancellationToken()).Result;

            //Assert
            Assert.Equal(1, messagesSent);
            _hubContext.Clients.Received().Client(Arg.Is<string>(_ => _ == boardClient.ConnectionId));
            clientProxy.Received().SendCoreAsync(Arg.Is<string>(_ => _ == BoardHubMethod.UpdateBoard), 
                Arg.Any<object?[]>(), Arg.Any<CancellationToken>());
        }
    }
}
