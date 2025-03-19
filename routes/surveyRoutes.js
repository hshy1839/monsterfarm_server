const express = require('express');
const { 
    createSurvey, 
    getAllSurvey,
    getSurvey,
    deleteSurvey,

} = require('../controllers/surveyController');

const router = express.Router();
const path = require('path');

// 공지사항 추가
router.post('/survey/create', createSurvey);
// 공지사항 목록 조회
router.get('/survey/read', getAllSurvey);
// 공지사항 특정 조회
router.get('/survey/read/:id', getSurvey);
// 공지사항 삭제
router.delete('/survey/delete/:id', deleteSurvey);

module.exports = router;
