TRUNCATE TABLE BoardCell

DECLARE @I TABLE(I INT NOT NULL)
INSERT INTO @I
SELECT 5000 - (ones.n + 10*tens.n + 100*hundreds.n + 1000*thousands.n)
FROM (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) ones(n),
        (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) tens(n),
        (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) hundreds(n),
        (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) thousands(n)
ORDER BY 1

INSERT INTO BoardCell(X, Y, Letter, UserId)
SELECT X.I, Y.I, CHAR((ABS(CHECKSUM(NEWID())) % 92) + 33), 'Sample' FROM 
    (SELECT TOP 3000 * FROM @I ORDER BY NEWID()) AS X
	INNER JOIN 
    (SELECT TOP 3000 * FROM @I ORDER BY NEWID()) AS Y ON 1 = 1