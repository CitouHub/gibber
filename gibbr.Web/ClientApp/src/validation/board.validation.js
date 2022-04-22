import * as Config from '../util/config';
import { board } from '../data/board.data';

export function canEditCell(x, y) {
    let user = Config.getUser();
    let neighbourCells = board.cells.filter(_ => _.vx >= x - 1 && _.vx <= x + 1 && _.vy >= y - 1 && _.vy <= y + 1);
    return neighbourCells.filter(_ => _.u !== undefined && _.u !== '' && user.id.endsWith(_.u) === false).length === 0;
}