import argparse, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4191/dist/')
args=parser.parse_args()
output=Path(__file__).parent/'artifacts';output.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 context=browser.new_context(viewport={'width':1440,'height':960},device_scale_factor=1)
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(args.url,wait_until='networkidle');page.wait_for_function('!!window.__STARFLUFF__');page.wait_for_timeout(1500)
 page.screenshot(path=str(output/'desktop-initial.png'))
 print('TITLE',page.title(),flush=True)
 print('INITIAL',page.evaluate('window.__STARFLUFF__.getState()'),flush=True)
 print('LAYOUT',page.evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth,canvas:document.querySelector("canvas").getBoundingClientRect().toJSON()})'),flush=True)
 def state():return page.evaluate('window.__STARFLUFF__.getState()')
 def wait_state(condition):page.wait_for_function(f'()=>{{const s=window.__STARFLUFF__.getState();return {condition};}}',timeout=30000)
 def plot(index):
  pt=page.evaluate('(i)=>window.__STARFLUFF__.getPlotScreenPosition(i)',index)
  page.mouse.click(pt['x'],pt['y'])
 def tower(kind,index):
  page.keyboard.press('Escape');page.locator(f'.tower-card[data-type="{kind}"]').click();plot(index);wait_state(f's.towers.some(t=>t.plotIndex==={index}&&t.type==="{kind}")')
 tower('bunny',0);page.locator('[data-action="upgrade"]').click();wait_state('s.towers[0].level===2')
 page.locator('[data-action="sell"]').click();wait_state('s.towers.length===0&&s.gold===272')
 for kind,index in [('cat',1),('bear',3),('owl',5)]:
  tower(kind,index);page.locator('[data-action="sell"]').click();wait_state('s.towers.length===0')
 tower('bunny',0);tower('bunny',1)
 page.locator('[data-action="startWave"]').click();wait_state('s.phase==="wave"')
 page.locator('[data-action="speed"]').click();wait_state('s.speed===2')
 page.locator('[data-action="pause"]').click();wait_state('s.paused')
 paused=state()['time'];page.wait_for_timeout(400);assert state()['time']==paused
 page.locator('[data-action="pause"]').click();wait_state('!s.paused')
 page.locator('[data-action="help"]').click();assert page.get_by_role('dialog').is_visible();assert state()['paused']
 page.locator('[data-action="modalClose"]').last.click();wait_state('!s.paused')
 page.locator('[data-action="sound"]').click();wait_state('!s.muted')
 wait_state('s.enemies.length>0');page.locator('[data-skill="freeze"]').click();wait_state('s.cooldowns.freeze>0')
 page.locator('[data-skill="meteor"]').click();wait_state('s.cooldowns.meteor>0')
 page.wait_for_timeout(500);page.screenshot(path=str(output/'desktop-battle.png'))
 wait_state('s.phase==="prepare"&&s.wave===1')
 print('WAVE1',json.dumps({k:state()[k] for k in ['phase','wave','hp','gold','kills','perfectWaves']},ensure_ascii=False),flush=True)
 page.locator('[data-action="restart"]').click();wait_state('s.wave===0&&s.towers.length===0')
 assert not errors,errors
 context.close()
 mobile=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
 page=mobile.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(args.url,wait_until='networkidle');page.wait_for_function('!!window.__STARFLUFF__');page.wait_for_timeout(1000)
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path=str(output/'mobile-initial.png'))
 page.locator('.tower-card[data-type="bunny"]').tap()
 pt=page.evaluate('window.__STARFLUFF__.getPlotScreenPosition(1)');page.touchscreen.tap(pt['x'],pt['y'])
 wait_state('s.towers.length===1');page.screenshot(path=str(output/'mobile-built.png'))
 print('MOBILE',json.dumps({'width':390,'tower':state()['towers'][0]['type'],'gold':state()['gold']},ensure_ascii=False),flush=True)
 page.locator('[data-action=closeSelection]').click()
 page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(600)
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 for selector in ['.tower-card[data-type=cat]','[data-action=startWave]','[data-skill=freeze]']:
  box=page.locator(selector).bounding_box();assert box['y']+box['height']<=390,(selector,box)
 page.locator('.tower-card[data-type=cat]').tap()
 pt=page.evaluate('window.__STARFLUFF__.getPlotScreenPosition(0)');page.touchscreen.tap(pt['x'],pt['y'])
 wait_state('s.towers.length===2');page.locator('[data-action=upgrade]').tap();wait_state('s.towers.some(t=>t.plotIndex===0&&t.level===2)')
 page.locator('[data-action=startWave]').tap();wait_state('s.phase==="wave"')
 page.screenshot(path=str(output/'landscape-battle.png'))
 print('LANDSCAPE',json.dumps({'width':844,'height':390,'phase':state()['phase'],'towers':len(state()['towers'])}),flush=True)
 assert not errors,errors
 print('PASS: browser smoke, four tower types, upgrade/sell, wave, skills, pause/help/speed/audio, restart, mobile touch and relative subdirectory assets.',flush=True)
 browser.close()
