import subprocess
from pathlib import Path
subprocess.run(['playwright-cli','-s=iron-siege','reload'],check=True)
r=subprocess.run(['playwright-cli','-s=iron-siege','eval',Path('check-gameplay.browser.js').read_text()],text=True,capture_output=True)
Path('output/playwright/gameplay-results.txt').write_text(r.stdout+r.stderr)
print(r.stdout)
raise SystemExit(r.returncode)
