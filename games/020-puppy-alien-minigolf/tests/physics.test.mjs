import assert from 'node:assert/strict';
import {COURSES} from '../dist/courses.js';
import {newBall,fireBall,stepBall} from '../dist/physics.js';
function sim(ball,course,seconds=20){let events=[],peak=0;for(let n=0;n<seconds*120&&ball.moving;n++){events.push(...stepBall(ball,course,1/120,n/120));peak=Math.max(peak,ball.y);if(events.includes('hole')||events.includes('out'))break;}return {ball,events,peak};}
let ball=newBall(COURSES[0].start);fireBall(ball,0,65);let r=sim(ball,COURSES[0]);assert.ok(r.events.includes('hole'),'The opening hole is achievable in one putt');
ball=newBall([0,4]);fireBall(ball,0,45);r=sim(ball,COURSES[1]);assert.ok(r.events.includes('obstacle'),'A grounded ball bounces off the wall');
ball=newBall([0,2.7]);fireBall(ball,0,65,true);r=sim(ball,COURSES[1]);assert.ok(r.peak>1.5,'Loft gains enough height to clear a low wall');assert.ok(r.ball.z<0,'Loft crosses the wall');
ball=newBall([-3,4.4]);fireBall(ball,0,25);r=sim(ball,COURSES[3]);assert.ok(r.events.includes('portal'),'The blue portal transports the ball');assert.ok(r.ball.z<0,'The portal crosses the divider');
ball=newBall([0,3]);fireBall(ball,0,25);r=sim(ball,COURSES[4]);assert.ok(r.events.includes('boost'),'The boost pad accelerates');assert.ok(r.events.includes('jump'),'The launch pad lifts the ball');
ball=newBall([-4.9,1.7]);fireBall(ball,0,25);r=sim(ball,COURSES[5]);assert.ok(r.events.includes('out'),'The fissure leads to recoverable out-of-bounds');
ball=newBall([0,4]);fireBall(ball,0,45);let grass=sim(ball,COURSES[0]);ball=newBall([0,4]);fireBall(ball,0,45);let sand=sim(ball,COURSES[2]);assert.ok(sand.ball.z>grass.ball.z,'Sand stops the ball sooner than grass');
for(const course of COURSES){ball=newBall(course.start);fireBall(ball,.7,100,true);r=sim(ball,course,25);assert.ok(r.events.includes('out')||r.events.includes('hole')||!r.ball.moving,`${course.name}: every shot resolves`);assert.ok(Number.isFinite(ball.x)&&Number.isFinite(ball.z),'Ball remains finite');}
ball=newBall([0,.95]);fireBall(ball,0,5);r=sim(ball,COURSES[4],35);assert.ok(!ball.moving,'A ball stops after landing back on the jump pad');assert.equal(r.events.filter(e=>e==='jump').length,1,'Jump pad triggers once per entry');
console.log('PASS: opening hole, wall bounce, loft, portal, boost, jump, fissure, sand, and all six courses resolve.');
