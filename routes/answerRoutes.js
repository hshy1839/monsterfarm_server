const express = require('express');
const { 
    createAnswers, 
    getAllAnswers,
    getAnswer
} = require('../controllers/answerController');

const router = express.Router();
const path = require('path');

// 설문 생성 (POST)
router.post('/answers', createAnswers);
router.get('/answers', getAllAnswers);
router.get('/answers/:id', getAnswer);


module.exports = router;
