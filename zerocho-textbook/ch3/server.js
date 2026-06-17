const http = require('http');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const users = {}; // 데이터 저장용

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET') {
      if (req.url === '/') {
        const indexPage = await fsp.readFile(
          path.join(__dirname, 'index.html')
        );

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(indexPage);
      } else if (req.url === '/about') {
        const aboutPage = await fsp.readFile(
          path.join(__dirname, 'about.html')
        );

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(aboutPage);
      } else if (req.url === '/users') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
        });
        return res.end(JSON.stringify(users));
      } else {
        try {
          const data = await fsp.readFile(path.join(__dirname, req.url));
          return res.end(data);
        } catch (err) {
          res.writeHead(404);
          return res.end('NOT FOUND');
        }
      }
    } else if (req.method === 'POST') {
      res.writeHead(200);
      return res.end();
      // ...생략
    } else if (req.method === 'PUT') {
      res.writeHead(200);
      return res.end();
      // ...생략
    } else if (req.method === 'DELETE') {
      res.writeHead(200);
      return res.end();
      // ...생략
    } else {
      res.writeHead(404);
      return res.end('NOT FOUND');
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(err.message);
  }
});

server.listen(8080);

server.on('listening', () => {
  console.log('8080번 포트에서 서버 대기 중입니다!');
});
server.on('error', error => {
  console.error(error);
});
