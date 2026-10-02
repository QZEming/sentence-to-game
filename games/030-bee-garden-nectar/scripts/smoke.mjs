import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
await mkdir('output/playwright', {recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5198');await page.waitForFunction(()=>window.__meadow);
await page.waitForTimeout(700);
await page.screenshot({path:'output/playwright/desktop.png'});
await page.getByTitle('操作指南').click();
assert.equal(await page.locator('#modal').isVisible(),true);
await page.getByText('出发，去寻一点甜').click();
const snap=()=>page.evaluate(()=>window.__meadow.snapshot());
async function go(x,z){for(let i=0;i<24;i++){let s=await snap(),dx=x-s.position[0],dz=z-s.position[2];if(Math.hypot(dx,dz)<.8)return;let right=dx*.829-dz*.559,down=dx*.559+dz*.829;let k=Math.abs(right)>Math.abs(down)?(right>0?'d':'a'):(down>0?'s':'w');let duration=Math.min(300,Math.max(40,Math.abs(Math.abs(right)>Math.abs(down)?right:down)/5.3*1000));await page.keyboard.down(k);await page.waitForTimeout(duration);await page.keyboard.up(k);}}
for(let i=0;i<12;i++){let s=await snap();if(s.bag===s.capacity)break;let f=s.availableFlowers.sort((a,b)=>Math.hypot(a.x-s.position[0],a.z-s.position[2])-Math.hypot(b.x-s.position[0],b.z-s.position[2]))[0];await go(f.x,f.z);await page.keyboard.press('e');await page.waitForTimeout(120);}
let full=await snap();assert.equal(full.bag,30);assert.ok(full.visits>=5);assert.ok(full.honey>=10);console.log('Full bag and first quest:',full.bag,full.visits,full.honey);
await go(-10,7);assert.equal((await snap()).atHome,true);await page.keyboard.press('e');await page.waitForTimeout(200);let bank=await snap();assert.equal(bank.bag,0);assert.ok(bank.honey>=60);console.log('Deposit + delivery quest:',bank.honey);
await page.locator('#shop').click();await page.locator('#buy-bag').click();await page.locator('#close').click();let upgraded=await snap();assert.equal(upgraded.capacity,45);assert.equal(upgraded.honey,bank.honey-25);console.log('Upgrade:',upgraded.capacity,upgraded.honey);
await page.reload();await page.waitForFunction(()=>window.__meadow);let restored=await snap();assert.equal(restored.capacity,45);assert.equal(restored.honey,upgraded.honey);assert.equal(restored.visits,full.visits);console.log('Persistence verified');
await page.keyboard.press('Escape');
assert.equal((await snap()).paused,true);
await page.keyboard.press('Escape');
assert.equal((await snap()).paused,false);
await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(200);
await page.screenshot({path:'output/playwright/mobile.png'});
assert.equal(await page.locator('#mobile-action').isVisible(),true);
assert.deepEqual(errors,[]);console.log('No browser errors');await browser.close();
