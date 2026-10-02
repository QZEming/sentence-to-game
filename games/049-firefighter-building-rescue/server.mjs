import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const port=Number(process.env.PORT)||4173;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{let urlPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+(urlPath==='/'?'/index.html':urlPath));if(!file.startsWith(root)){res.writeHead(403).end();return;}const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(body);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Fire Command ready: http://localhost:${port}`));
