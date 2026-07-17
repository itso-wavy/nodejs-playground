const express = require('express');
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('GET /user 경로입니다.');
});

userRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log('req.params: ', req.params);
  res.send(`userId: ${id}`);
});

userRouter.get('/like', (req, res) => {
  console.log('★이것은 실행되지 않습니다.★ 상단의 /:id 라우트 때문에');
});

module.exports = userRouter;
