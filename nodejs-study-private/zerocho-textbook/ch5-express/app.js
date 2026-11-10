const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');
const userRouter = require('./routes/user');

/* ===== INITIALIZING ===== */
const PORT = process.env.PORT || 3000;

const app = express();
app.set('port', PORT);
app.set('view engine', 'html');

try {
  fs.readdirSync('uploads');
} catch (err) {
  fs.mkdirSync('uploads');
}

/* ===== TEMPLATE ENGINE ===== */
nunjucks.configure('views', {
  // 템플릿 엔진 기준 경로 지정
  express: app,
  watch: true,
});

/* ===== MIDDLEWARE ===== */
/* app.use(morgan('dev')); // dev, combined, common, short, tiny
app.use('/', express.static(path.join(__dirname, 'public'))); // 정적 파일 위치 설정

app.use(express.json()); // body-parser:json
app.use(express.urlencoded({ extended: true })); // body-parser:form-data

const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET;
app.use(cookieParser(COOKIE_SECRET_KEY));
 */
// 위 구문 한번에 쓰기
app.use(
  morgan('dev'),
  express.static(path.join(__dirname, 'public')),
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(process.env.COOKIE_SECRET),
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: false,
      secure: true,
    },
    name: 'session-cookie',
  })
);

/* ===== ROUTER ===== */
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use((req, res, next) => {
  // res.status(404).send('Not Found');
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);

  error.status = 404;
  next(error);
});

/* ===== ERROR HANDLING ===== */
app.use((err, req, res, next) => {
  res.locals.message = err.message;

  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(PORT, '번 포트에서 대기 중');
});
