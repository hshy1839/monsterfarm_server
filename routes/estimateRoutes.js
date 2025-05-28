const express = require('express');
const { 
    estimatesUpload,
    getMyEstimates,
    getEstimateById,
} = require('../controllers/estimateController');

const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/estimates/'); // 저장 경로
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    },
  });
  const upload = multer({ storage });

// 디버깅 로그 추가: 요청 경로 확인
router.use((req, res, next) => {
    next();
});
// 설문 생성 (POST)
router.post('/estimates', upload.array('images'), estimatesUpload);
router.get('/estimates', getMyEstimates);
router.get('/estimates/detail/:id', getEstimateById);


module.exports = router;
