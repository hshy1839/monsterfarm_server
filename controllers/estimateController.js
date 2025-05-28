const jwt = require('jsonwebtoken');
const Estimate = require('../models/Estimate'); 
const JWT_SECRET = 'jm_shoppingmall';

exports.estimatesUpload = async (req, res) => {
    console.log('🧾 req.body:', req.body);
console.log('🖼️ req.files:', req.files);

  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ success: false, message: '토큰이 필요합니다.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
    }

    const userId = decoded.userId;
    const { surveyId } = req.body;
    const imageFiles = req.files || [];

    if (!surveyId || !imageFiles.length) {
      return res.status(400).json({ success: false, message: '필수 정보가 누락되었습니다.' });
    }

    const imagePaths = imageFiles.map(file => file.path);

    const estimate = new Estimate({
      surveyId,
      uploadedBy: userId,
      images: imagePaths,
    });

    await estimate.save();

    return res.status(200).json({ success: true, message: '견적서 업로드 완료', estimate });
  } catch (err) {
    console.error('견적서 업로드 실패:', err);
    return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
