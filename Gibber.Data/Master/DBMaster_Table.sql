--Scaffold-DbContext "Server=localhost\SQLEXPRESS02;Initial Catalog=Gibber;persist security info=True;Integrated Security=SSPI;MultipleActiveResultSets=True" Microsoft.EntityFrameworkCore.SqlServer -OutputDir . -Context GibberDbContext -Force

IF OBJECTPROPERTY(object_id('dbo.BoardCell'), N'IsTable') = 1 DROP TABLE [dbo].[BoardCell]
GO
CREATE TABLE [dbo].[BoardCell](
	[X] [bigint] NOT NULL,
	[Y] [bigint] NOT NULL,
	[InsertDate] [datetime2](7) NOT NULL DEFAULT(GETUTCDATE()),
	[Letter] [char] NOT NULL,
	[Color] [nvarchar](10) NULL,
	[Background] [nvarchar](10) NULL,
	[Source] [nvarchar](500) NOT NULL
 CONSTRAINT [BoardCell_PK] PRIMARY KEY CLUSTERED 
(
	[X] ASC, [Y] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
