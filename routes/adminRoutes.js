const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAllUsers,
  getUser,
  deleteUser,
  createQuestion,
  editQuestion,
  deleteQuestion,
  getAllQuestion,
} = require('../controllers/adminControler');

router.post('/login', adminLogin);
router.post('/create/question', createQuestion);
router.get('/questions', getAllQuestion);
router.put('/edit/question/:id', editQuestion);
router.delete('/delete/question/:id', deleteQuestion);

router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.delete('/user/delete/:id', deleteUser);

module.exports = router;
