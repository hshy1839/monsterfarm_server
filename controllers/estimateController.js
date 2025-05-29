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
    const { answerId, manufacturer, price, droneBaseName, items } = req.body;

    if (!answerId || !manufacturer || !price || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: '필수 정보가 누락되었습니다.' });
    }



    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items; // 프론트에서 문자열로 보낼 수 있음

    const estimate = new Estimate({
        answerId,
      uploadedBy: userId,
      manufacturer,
      price,
      droneBaseName,
      items: parsedItems,
    });

    await estimate.save();

    return res.status(200).json({ success: true, message: '견적서 업로드 완료', estimate });
  } catch (err) {
    console.error('견적서 업로드 실패:', err);
    return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

exports.getMyEstimates = async (req, res) => {
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
  
      const estimates = await Estimate.find({ uploadedBy: userId })
      .populate({
        path: 'answerId',
        populate: {
          path: 'userId',
          select: 'name', // 유저의 이름만 가져오기
        }
      })
      .sort({ createdAt: -1 })
      .lean();
      return res.status(200).json({ success: true, estimates });
    } catch (err) {
      console.error('견적서 목록 불러오기 실패:', err);
      return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
    }
  };
  
  exports.getEstimateById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const estimate = await Estimate.findById(id)
        .populate({
          path: 'answerId',
          populate: {
            path: 'userId',
            select: 'name', // 유저 이름만 가져오기
          },
        })
        .lean();
  
      if (!estimate) {
        return res.status(404).json({ success: false, message: '견적서를 찾을 수 없습니다.' });
      }
  
      return res.status(200).json({ success: true, estimate });
    } catch (err) {
      console.error('견적서 조회 실패:', err);
      return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
    }
  };
  
  exports.getEstimatesByAnswerId = async (req, res) => {
    try {
      const { answerId } = req.params;
      const estimates = await Estimate.find({ answerId })
        .populate({
          path: 'answerId',
          populate: { path: 'userId', select: 'name' },
        })
        .sort({ createdAt: -1 })
        .lean();
  
      return res.status(200).json({ success: true, estimates });
    } catch (err) {
      return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
    }
  };
  