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

	SELECT X, Y, Letter FROM BoardCell WHERE X >= @X AND X <= @X + @DX AND Y >= @Y AND Y <= @Y + @DY
END
GO