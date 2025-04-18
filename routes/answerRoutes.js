const express = require('express');
const { 
    createAnswers, 
    getAllAnswers,
    getAnswer,
    deleteAnswer,
    updateAnswer,
    addtionalAnswers,
    getAnswerMine ,
} = require('../controllers/answerController');

const router = express.Router();
const path = require('path');

// 설문 생성 (POST)
router.post('/answers', createAnswers);
router.get('/answers/mine', getAnswerMine);  

router.post('/answers/additional', addtionalAnswers);
    router.get('/answers', getAllAnswers);
router.get('/answers/:id', getAnswer);  
router.delete('/answers/:id', deleteAnswer);
router.put('/answers/:id', updateAnswer);



module.exports = router;
