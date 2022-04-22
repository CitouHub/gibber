--Scaffold-DbContext "Server=localhost\SQLEXPRESS02;Initial Catalog=Gibbr;persist security info=True;Integrated Security=SSPI;MultipleActiveResultSets=True" Microsoft.EntityFrameworkCore.SqlServer -OutputDir . -Context BaseDbContext -Force

IF OBJECTPROPERTY(object_id('dbo.BoardCell'), N'IsTable') = 1 DROP TABLE [dbo].[BoardCell]
GO
CREATE TABLE [dbo].[BoardCell](
	[X] [bigint] NOT NULL,
	[Y] [bigint] NOT NULL,
	[UserId] [nvarchar](50) NOT NULL,
	[InsertDate] [datetime2](7) NOT NULL DEFAULT(GETUTCDATE()),
	[UpdateDate] [datetime2](7) NULL,
	[Letter] [char] NOT NULL,
	[Color] [nvarchar](10) NULL,
	[Background] [nvarchar](10) NULL
 CONSTRAINT [BoardCell_PK] PRIMARY KEY CLUSTERED 
(
	[X] ASC, [Y] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
