const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const Reservation = require('../models/Reservation');
const JWT_SECRET = 'jm_shoppingmall'


exports.createReservation = async (req, res) => {
    try {
      const { token } = req.body;
  
      if (!token) {
        return res.status(400).json({ message: '토큰이 필요합니다.' });
      }
  
      // 토큰 검증 및 디코드
      const decoded = jwt.verify(token, JWT_SECRET); // 환경변수에 JWT_SECRET 있어야 함
      const userId = decoded.userId;
  
      if (!userId) {
        return res.status(400).json({ message: '토큰에서 사용자 ID를 확인할 수 없습니다.' });
      }
  
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
      }
  
      // 예약 생성
      const newReservation = new Reservation({ user: userId });
      const saved = await newReservation.save();
  
      res.status(201).json(saved);
    } catch (error) {
      console.error('❌ 예약 생성 오류:', error);
      res.status(500).json({ message: '서버 오류로 예약을 생성할 수 없습니다.' });
    }
  };

// ✅ 모든 예약 조회 (GET /api/reservations)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user');
    res.status(200).json(reservations);
  } catch (error) {
    console.error('❌ 예약 목록 조회 오류:', error);
    res.status(500).json({ message: '예약 목록을 불러오는 데 실패했습니다.' });
  }
};

// ✅ 특정 예약 조회 (GET /api/reservations/:id)
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('user');

    if (!reservation) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error('❌ 예약 조회 오류:', error);
    res.status(500).json({ message: '예약 조회 중 오류가 발생했습니다.' });
  }
};

// ✅ 예약 수정 (PUT /api/reservations/:id)
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Reservation.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: '수정할 예약을 찾을 수 없습니다.' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('❌ 예약 수정 오류:', error);
    res.status(500).json({ message: '예약 수정 중 오류가 발생했습니다.' });
  }
};
