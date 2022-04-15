CREATE TABLE [dbo].[Board](
	[X] [bigint] NOT NULL,
	[Y] [bigint] NOT NULL,
	[InsertDate] [datetime2](7) NOT NULL,
	[Letter] [nvarchar](1) NOT NULL,
	[Color] [nvarchar](10) NOT NULL,
	[Background] [nvarchar](10) NOT NULL,
	[Source] [nvarchar](500) NOT NULL
 CONSTRAINT [Board_PK] PRIMARY KEY CLUSTERED 
(
	[X] ASC, [Y] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
