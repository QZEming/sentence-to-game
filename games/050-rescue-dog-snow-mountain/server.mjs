import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist');
createServer(async(req,res)=>{try{let url=new URL(req.url,'http://localhost');const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root+'/')){res.writeHead(403).end();return}const body=await readFile(path);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript'})[extname(path)]||'application/octet-stream');res.end(body)}catch{res.writeHead(404).end('Not found')}}).listen(5191,'127.0.0.1',()=>console.log('Alpine rescue http://127.0.0.1:5191'));
