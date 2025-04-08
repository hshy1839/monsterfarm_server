const express = require('express');
const { 
    createSurvey, 
    getAllSurvey,
    getSurvey,
    deleteSurvey,
    updateSurvey,
    updateSurveyOrder

} = require('../controllers/surveyController');

const router = express.Router();
const path = require('path');

// 설문 생성 (POST)
router.post('/survey', createSurvey);

// 설문 목록 조회 (GET)
router.get('/survey', getAllSurvey);

// 특정 설문 조회 (GET)
router.get('/survey/:id', getSurvey);

// 설문 삭제 (DELETE)
router.delete('/survey/:id', deleteSurvey);
router.put('/survey/:id', updateSurvey);
router.patch('/survey/order', updateSurveyOrder);


module.exports = router;
