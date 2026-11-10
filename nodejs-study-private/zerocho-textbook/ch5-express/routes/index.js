const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ===== ROUTER.GET ===== */
router.get('/', (req, res, next) => {
  res.render('index', { foo: 'Express' });
  // views/index.html
  // foo 변수 할당
});

/* ===== ROUTER.ROUTE ===== */
router
  .route('/main')
  .get((req, res) => {
    res.send('GET /main 경로입니다.');
  })
  .post((req, res) => {
    res.send('POST /main 경로입니다.');
  });

router
  .route('/upload')
  .get((req, res) => {
    res.sendFile('public/multipart.html', { root: path.join(__dirname, '..') });
  })

  .post(upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
  });

// 에러 처리
router.use((err, rq, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

module.exports = router;
