import {solve} from './engine.js';
self.onmessage=({data})=>self.postMessage(solve(data.level,data.state,220000));
