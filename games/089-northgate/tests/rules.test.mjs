import test from 'node:test';
import assert from 'node:assert/strict';
import {DAYS, createTraveler, verdictFor} from '../dist/data.js';

const expected=[
 ['approve','deny','deny','detain','approve','deny'],
 ['deny','approve','deny','deny','deny','approve'],
 ['deny','deny','approve','deny','detain','approve'],
 ['approve','detain','approve','deny','detain','deny'],
 ['deny','approve','detain','deny','deny','approve']
];
test('all 30 cases have their intended ruling, including subsequent campaigns',()=>{
 for(const run of [0,1,3,15])for(let day=1;day<=5;day++)for(let i=0;i<6;i++){
  const result=verdictFor(createTraveler(day,i,run),day);
  assert.equal(result.action,expected[day-1][i],`day=${day}, case=${i}, run=${run}`);
  assert.ok(result.reasons.length);
 }
});
test('passport is valid on expiry day, invalid the next day',()=>{
 const p=createTraveler(5,5);assert.equal(p.expires,DAYS[4].date);
 assert.equal(verdictFor(p,5).action,'approve');p.expires='1984.11.09';assert.equal(verdictFor(p,5).action,'deny');
});
test('exact passport number controls wanted match; names do not',()=>{
 const p=createTraveler(4,0);assert.equal(p.name,'维克多·罗森');assert.equal(verdictFor(p,4).action,'approve');
 p.number='NX-08419';p.permitNumber=p.number;assert.equal(verdictFor(p,4).action,'detain');
});
test('40kg is inclusive and the first day has no weight limit',()=>{
 const p=createTraveler(2,1);p.goods[0].weight=32;
 assert.equal(verdictFor(p,2).action,'approve');p.goods[0].weight=33;
 assert.equal(verdictFor(p,2).action,'deny');assert.equal(verdictFor(p,1).action,'approve');
});
test('detention overrides expired documents and undeclared cargo',()=>{
 const p=createTraveler(5,2),v=verdictFor(p,5);assert.equal(v.action,'detain');assert.ok(v.reasons.length>=3);
});
test('forgery response changes from rejection on day 2 to detention on day 3',()=>{
 const p=createTraveler(2,3);assert.equal(verdictFor(p,2).action,'deny');assert.equal(verdictFor(p,3).action,'detain');
 assert.ok(DAYS[1].rules.some(r=>r.includes('防伪')&&r.includes('拒绝')));
});
test('embargo is lifted on day 4',()=>{
 const p=createTraveler(2,0);assert.equal(verdictFor(p,2).action,'deny');assert.equal(verdictFor(p,3).action,'deny');assert.equal(verdictFor(p,4).action,'approve');
});
test('medical license applies only to medicine on day 5',()=>{
 const p=createTraveler(5,0);assert.equal(verdictFor(p,4).action,'approve');assert.equal(verdictFor(p,5).action,'deny');p.medicinePermit=true;assert.equal(verdictFor(p,5).action,'approve');
});
