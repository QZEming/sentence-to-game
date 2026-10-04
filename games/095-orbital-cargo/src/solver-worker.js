import {solve} from './game.js';
self.onmessage=({data})=>self.postMessage(solve(data.pieces,data.dims,data.placements,12000));
