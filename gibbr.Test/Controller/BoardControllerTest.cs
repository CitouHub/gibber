using System.Collections.Generic;
using System.Linq;
using System.Net;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Xunit;

using gibbr.API.Controllers;
using gibbr.API.Infrastructure;
using gibbr.Domain;
using gibbr.Service;

namespace gibbr.Test
{
    public class BoardControllerTest
    {
        private readonly BoardController _boardController;
        private readonly IBoardService _boardService = Substitute.For<IBoardService>();
        private readonly ISetBoardCellQueue _setBoardCellQueue = Substitute.For<ISetBoardCellQueue>();

        public BoardControllerTest()
        {
            var logger = Substitute.For<ILogger<BoardController>>();
            _boardController = new BoardController(logger, _boardService, _setBoardCellQueue);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(1)]
        [InlineData(10)]
        public void GetBoardCells_Ok(short cells)
        {
            //Setup
            long x = 10;
            long y = 11;
            short dx = 12;
            short dy = 13;
            _boardService.GetBoardCellsAsync(Arg.Is(x), Arg.Is(y), Arg.Is(dx), Arg.Is(dy))
                .Returns(Enumerable.Repeat(new BoardCellDTO(), cells).ToList());

            //Act
            var action = _boardController.GetBoardCellsAsync(x, y, dx, dy).Result;
            var result = action as OkObjectResult;
            var content = result?.Value as List<BoardCellDTO>;

            //Assert
            Assert.Equal((int)HttpStatusCode.OK, result?.StatusCode);
            Assert.Equal(cells, content?.Count);
            _boardService.Received().GetBoardCellsAsync(Arg.Is(x), Arg.Is(y), Arg.Is(dx), Arg.Is(dy));
        }

        [Theory]
        [InlineData(-1, -1)]
        [InlineData(-1, 0)]
        [InlineData(-1, 1)]
        [InlineData(0, -1)]
        [InlineData(0, 0)]
        [InlineData(0, 1)]
        [InlineData(1, -1)]
        [InlineData(1, 0)]
        public void GetBoardCells_BadRequest(short dx, short dy)
        {
            //Act
            var action = _boardController.GetBoardCellsAsync(0, 0, dx, dy).Result;
            var result = action as BadRequestObjectResult;

            //Assert
            Assert.Equal((int)HttpStatusCode.BadRequest, result?.StatusCode);
            _boardService.DidNotReceive().GetBoardCellsAsync(
                Arg.Any<long>(), Arg.Any<long>(), Arg.Any<short>(), Arg.Any<short>());
        }

        [Theory]
        [InlineData(0)]
        [InlineData(1)]
        [InlineData(10)]
        public void AddBoardCells_Ok(short cells)
        {
            //Setup 
            var userId = "AddBoardCells_Ok";
            var list = Enumerable.Repeat(new BoardCellDTO(), cells).ToList();

            //Act
            var action = _boardController.AddBoardCells(list, userId);
            var result = action as OkResult;

            //Assert
            Assert.Equal((int)HttpStatusCode.OK, result?.StatusCode);
            _setBoardCellQueue.Received(cells).Enqueue(Arg.Is<BoardCellDTO>(_ => _.UserId == userId));
        }
    }
}