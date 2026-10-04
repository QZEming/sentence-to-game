export function frameComplete(frame, index) {
  if (index < 9) return frame[0] === 10 || frame.length >= 2;
  return frame.length >= (frame[0] === 10 || (frame[0] || 0) + (frame[1] || 0) === 10 ? 3 : 2);
}
export function scores(frames) {
  let total = 0;
  return frames.map((frame, index) => {
    if (!frame.length) return null;
    if (index === 9) { total += frame.reduce((a,b)=>a+b,0); return total; }
    const next = frames.slice(index+1).flat();
    if (frame[0] === 10) { if(next.length < 2) return null; total += 10 + next[0] + next[1]; }
    else if (frame.length < 2) return null;
    else if (frame[0]+frame[1]===10) { if(!next.length) return null; total +=10+next[0]; }
    else total +=frame[0]+frame[1];
    return total;
  });
}
export function rollLabel(frame, index) {
  return frame.map((n,i)=> {
    if (i === 0) return n===10?'X':n||'–';
    if (i===1 && frame[0]!==10 && n+frame[0]===10) return '/';
    if (i===2 && frame[0]===10 && frame[1]!==10 && frame[1]+n===10) return '/';
    return n===10?'X':n||'–';
  }).join(' ');
}
