IF OBJECTPROPERTY(object_id('dbo.sp_getBoardCells'), N'IsProcedure') = 1 DROP PROCEDURE [dbo].[sp_getBoardCells]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_getBoardCells]
-- =====================================================================
-- Author:			Rikard Gustafsson
-- Create date:		2022-04-16
-- Description:		
-- =====================================================================
	@X BIGINT,
	@Y BIGINT,
	@DX SMALLINT,
	@DY SMALLINT
AS
BEGIN
	SET NOCOUNT ON

	SELECT X, Y, RIGHT(UserId, 4) AS UserId, Letter 
	FROM BoardCell WHERE X >= @X AND X <= @X + @DX AND Y >= @Y AND Y <= @Y + @DY
END
GO

IF OBJECTPROPERTY(object_id('dbo.sp_getBoardCellState'), N'IsProcedure') = 1 DROP PROCEDURE [dbo].[sp_getBoardCellState]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_getBoardCellState]
-- =====================================================================
-- Author:			Rikard Gustafsson
-- Create date:		2022-04-18
-- Description:		
-- =====================================================================
	@X BIGINT,
	@Y BIGINT,
	@UserId NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @State TINYINT
	DECLARE @ExistingBoardCellUserId NVARCHAR(50)
	SET @State = 3 --Locked
	SET @ExistingBoardCellUserId = (SELECT UserId FROM BoardCell WHERE X = @X AND Y = @Y)

	DECLARE @Occupied BIT
	SET @Occupied = CAST(CASE WHEN EXISTS(SELECT TOP 1 X, Y FROM BoardCell WHERE UserId <> @UserId
		AND X >= @X - 1 AND X <= @X + 1 AND Y >= @Y - 1 AND Y <= @Y + 1) THEN 1 ELSE 0 END AS BIT)

	IF(@Occupied = 0)
	BEGIN
		IF(NOT EXISTS(SELECT TOP 1 X, Y FROM BoardCell WHERE X = @X AND Y = @Y)) 
		BEGIN
			SET @State = 1 --Can add
		END
		ELSE 
		BEGIN
			SET @State = 2 --Can update
		END
	END

	SELECT @State AS Result
END
GO

IF OBJECTPROPERTY(object_id('dbo.sp_addBoardCell'), N'IsProcedure') = 1 DROP PROCEDURE [dbo].[sp_addBoardCell]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_addBoardCell]
-- =====================================================================
-- Author:			Rikard Gustafsson
-- Create date:		2022-04-18
-- Description:		
-- =====================================================================
	@X BIGINT,
	@Y BIGINT,
	@UserId NVARCHAR(50),
	@Letter NVARCHAR(1)
AS
BEGIN
	SET NOCOUNT ON

	IF @Letter <> '' 
	BEGIN
		INSERT INTO BoardCell(X, Y, UserId, Letter) VALUES (@X, @Y, @UserId, @Letter)
	END

	SELECT CAST(1 AS BIT) AS Result
END
GO

IF OBJECTPROPERTY(object_id('dbo.sp_updateBoardCell'), N'IsProcedure') = 1 DROP PROCEDURE [dbo].[sp_updateBoardCell]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_updateBoardCell]
-- =====================================================================
-- Author:			Rikard Gustafsson
-- Create date:		2022-04-18
-- Description:		
-- =====================================================================
	@X BIGINT,
	@Y BIGINT,
	@Letter NVARCHAR(1)
AS
BEGIN
	SET NOCOUNT ON

	IF @Letter <> ''
	BEGIN
		UPDATE BoardCell SET
			UpdateDate = GETUTCDATE(),
			Letter = @Letter
		WHERE X = @X AND Y = @Y
	END 
	ELSE 
	BEGIN
		DELETE BoardCell WHERE X = @X AND Y = @Y
	END

	SELECT CAST(1 AS BIT) AS Result
END
GO