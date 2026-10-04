"""Bundle the existing static game into one offline HTML file, without dependencies."""
from pathlib import Path
import base64
import json
import re

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
three = (DIST / 'vendor/three.module.js').read_text()
exports = list(re.finditer(r'export\s*\{([^}]+)\}\s*;', three, re.S))
assert len(exports) == 1 and not re.search(r'^import ', three, re.M)
items = []
for item in exports[0].group(1).split(','):
    item = item.strip()
    if not item:
        continue
    parts = re.split(r'\s+as\s+', item)
    items.append(f'{parts[1]}:{parts[0]}' if len(parts) == 2 else item)
three = three[:exports[0].start()] + three[exports[0].end():]

def script(name):
    text = (DIST / name).read_text()
    text = re.sub(r'^import .*?;\n', '', text, flags=re.M)
    return re.sub(r'^export ', '', text, flags=re.M)

icons = script('icons.js')
scene = script('scene.js')
game = script('game.js')
load_questions = "const response=await fetch('./questions.json');if(!response.ok)throw new Error('题库加载失败');questions=await response.json();"
assert load_questions in game
bank = json.dumps(json.loads((DIST / 'questions.json').read_text()), ensure_ascii=False).replace('<', '\\u003c')
game = game.replace(load_questions, 'questions=' + bank + ';')
license_text = (DIST / 'vendor/THREE-LICENSE.txt').read_text()
code = ('/* ' + license_text + ' */\n(()=>{const THREE=(()=>{' + three + ';return {' + ','.join(items) + '};})();'
        + 'const {icon,hydrateIcons}=(()=>{' + icons + ';return {icon,hydrateIcons};})();'
        + scene + game + '})();')
code = code.replace('</script', '<\\/script')
css = (DIST / 'style.css').read_text()
image = base64.b64encode((DIST / 'assets/forest.png').read_bytes()).decode()
css = css.replace("url('./assets/forest.png')", "url('data:image/png;base64," + image + "')")
html = (DIST / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="./style.css">', '<style>' + css + '</style>')
html = html.replace('<script type="module" src="./game.js"></script>', '')
html = html.replace('</body>', '<script>' + code + '</script></body>')
out = ROOT.parent / 'wild-wisdom-offline.html'
out.write_text(html)
print(f'{out} ({out.stat().st_size:,} bytes)')
