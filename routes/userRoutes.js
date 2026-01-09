const express = require('express');
const {
  createUser,
  loginUser,
  updateSolvedQuestion,
  explain,
  getUser,
} = require('../controllers/userControler');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/user/solved', updateSolvedQuestion);
router.post('/user/explain', explain);
router.get('/user', getUser);

module.exports = router;
