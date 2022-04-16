TRUNCATE TABLE Board

DECLARE @X TABLE(I INT NOT NULL)
DECLARE @Y TABLE(I INT NOT NULL)
INSERT INTO @X
SELECT ones.n + 10*tens.n + 100*hundreds.n + 1000*thousands.n
FROM (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) ones(n),
        (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) tens(n),
        (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) hundreds(n),
        (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) thousands(n)
ORDER BY 1
INSERT INTO @Y SELECT TOP 1000 I FROM @X ORDER BY NEWID()

INSERT INTO Board(X, Y, Letter, Source)
SELECT X.I, Y.I, CHAR((X.I+Y.I)%57 + 65), 'Sample' FROM @X AS X
	INNER JOIN @Y AS Y ON 1 = 1