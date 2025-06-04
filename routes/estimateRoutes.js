const express = require('express');
const { 
    estimatesUpload,
    getMyEstimates,
    getEstimateById,
    getEstimatesByAnswerId,
    selectEstimate,
    getAllEstimates,
    deleteEstimateById,
    approveEstimateById,
    getMyEstimateCountByAnswerId,
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
router.get('/estimates/by-answer/:answerId', getEstimatesByAnswerId);
router.post('/estimates/select',  selectEstimate);
router.get('/estimates/all', getAllEstimates);

router.patch('/estimates/:id/approve',  approveEstimateById);
router.delete('/estimates/:id', deleteEstimateById);
router.get('/estimates/my/count/:answerId', getMyEstimateCountByAnswerId);
module.exports = router;