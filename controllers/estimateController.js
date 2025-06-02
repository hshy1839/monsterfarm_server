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
      .populate({ path: 'uploadedBy', select: 'name' })
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
        .populate({ path: 'uploadedBy', select: 'name' })
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
  
  exports.selectEstimate = async (req, res) => {
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
      const { estimateId } = req.body;
  
      if (!estimateId) {
        return res.status(400).json({ success: false, message: 'estimateId가 필요합니다.' });
      }
  
      const estimate = await Estimate.findById(estimateId);
      if (!estimate) {
        return res.status(404).json({ success: false, message: '견적서를 찾을 수 없습니다.' });
      }
  
      // 이미 선택된 경우 방지 로직(선택된 견적서가 존재할 경우 제거하거나 선택 불가 처리 가능)
      await Estimate.updateMany(
        { answerId: estimate.answerId },
        { $set: { is_selected: false, selectedBy: null } }
      );
  
      estimate.is_selected = true;
      estimate.selectedBy = userId;
  
      await estimate.save();
  
      return res.status(200).json({ success: true, message: '견적서가 선택되었습니다.', estimate });
    } catch (err) {
      console.error('견적 선택 실패:', err);
      return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
    }
  };
  
  exports.getAllEstimates = async (req, res) => {
    try {
      const estimates = await Estimate.find()
        .populate({
          path: 'answerId',
          populate: { path: 'userId', select: 'name' },
        })
        .populate({ path: 'uploadedBy', select: 'name' })
        .sort({ createdAt: -1 })
        .lean();
  
      return res.status(200).json({ success: true, estimates });
    } catch (err) {
      console.error('전체 견적 조회 실패:', err);
      return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
    }
  };

  exports.deleteEstimateById = async (req, res) => {
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
  
      const { id } = req.params;
  
      const estimate = await Estimate.findById(id);
      if (!estimate) {
        return res.status(404).json({ success: false, message: '견적서를 찾을 수 없습니다.' });
      }
  
      await Estimate.findByIdAndDelete(id);
  
      return res.status(200).json({ success: true, message: '견적서가 삭제되었습니다.' });
    } catch (err) {
      console.error('견적서 삭제 실패:', err);
      return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
    }
  };
  
  exports.approveEstimateById = async (req, res) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(403).json({ success: false, message: '토큰이 필요합니다.' });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const { id } = req.params;
      const { is_approved } = req.body;
  
      if (typeof is_approved !== 'boolean') {
        return res.status(400).json({ success: false, message: 'is_approved 값이 필요합니다 (true 또는 false).' });
      }
  
      const estimate = await Estimate.findById(id);
      if (!estimate) {
        return res.status(404).json({ success: false, message: '견적서를 찾을 수 없습니다.' });
      }
  
      estimate.is_approved = is_approved;
      await estimate.save();
  
      return res.status(200).json({ success: true, message: '승인 상태가 변경되었습니다.', estimate });
    } catch (err) {
      console.error('승인 상태 변경 실패:', err);
      return res.status(500).json({ success: false, message: '서버 오류', error: err.message });
    }
  };
  