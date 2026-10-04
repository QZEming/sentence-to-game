export function scoreFrames(frames) {
  const rolls=frames.flat(); let index=0,total=0; const totals=[];
  for(let i=0;i<Math.min(frames.length,10);i++) {
    const f=frames[i]; if(!f.length){totals.push(null);continue;}
    if(i===9){const complete=f.length>=3||f.length===2&&f[0]+f[1]<10;if(complete){total+=f.reduce((a,b)=>a+b,0);totals.push(total);}else totals.push(null);break;}
    if(f[0]===10){if(rolls[index+2]!==undefined){total+=10+rolls[index+1]+rolls[index+2];totals.push(total);}else totals.push(null);index++;}
    else if(f.length<2){totals.push(null);index+=f.length;}
    else if(f[0]+f[1]===10){if(rolls[index+2]!==undefined){total+=10+rolls[index+2];totals.push(total);}else totals.push(null);index+=2;}
    else{total+=f[0]+f[1];totals.push(total);index+=2;}
  }
  return {total,totals};
}
export function frameComplete(frame,index){return index<9?(frame[0]===10||frame.length>=2):(frame.length>=3||frame.length===2&&frame[0]+frame[1]<10);}
export function frameMarks(frame,index){return frame.map((n,i)=>{if(n===10&&(i===0||index===9&&(i===1&&frame[0]===10||i===2&&(frame[0]+frame[1]===10||frame[1]===10))))return 'X';if(i>0&&frame[i-1]!==10&&frame[i-1]+n===10)return '/';return n===0?'–':String(n);}).join(' ');}
