export function seeded(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
export function generateMaze(N,rnd){let grid=Array.from({length:N},()=>Array(N).fill(1));function carve(x,z){grid[z][x]=0;const dirs=[[2,0],[-2,0],[0,2],[0,-2]].sort(()=>rnd()-.5);for(let [dx,dz]of dirs){let nx=x+dx,nz=z+dz;if(nx>0&&nz>0&&nx<N-1&&nz<N-1&&grid[nz][nx]){grid[z+dz/2][x+dx/2]=0;carve(nx,nz)}}}carve(1,1);
// Small chambers and cross passages keep the labyrinth inviting.
for(let [cx,cz]of [[1,1],[7,7],[13,3],[15,15]])for(let z=cz;z<cz+2;z++)for(let x=cx;x<cx+2;x++)grid[z][x]=0;
for(let z=1;z<N-1;z++)for(let x=1;x<N-1;x++)if(grid[z][x]===1&&rnd()<.23)grid[z][x]=2;
return grid;
}
