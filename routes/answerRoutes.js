const express = require('express');
const { 
    createAnswers, 
} = require('../controllers/answerController');

const router = express.Router();
const path = require('path');

// 설문 생성 (POST)
router.post('/answers', createAnswers);


module.exports = router;
