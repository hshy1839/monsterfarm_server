const jwt = require('jsonwebtoken');
const { Survey } = require('../models/Survey'); 
const path = require('path');
const JWT_SECRET = 'jm_shoppingmall';
const mongoose = require("mongoose");


// 상품 생성 (category 통합)
exports.createSurvey = async (req, res) => {
    try {
        // 토큰 검증
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ success: false, message: 'Token is required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: 'Token does not contain userId' });
        }

        // 요청에서 데이터 추출
        const { name, type, questions, isRequired } = req.body;

        // 필수 값 검증
        if (!name || !type || !questions ||  typeof isRequired !== 'boolean' || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: 'name, type, and questions are required' });
        }

        // questions 배열 검사 (객관식일 경우 선택지 필수)
        const formattedQuestions = questions.map(q => ({
            questionText: q.questionText,
            type: q.type, // ✅ 여기도 추가
            options: q.options || []
          }));

        // 설문 생성
        const survey = new Survey({
            name,
            type,
            isRequired,
            questions: formattedQuestions,
            createdAt: new Date(),
        });

        const createdSurvey = await survey.save();

        return res.status(200).json({
            success: true,
            survey: createdSurvey,
        });
    } catch (err) {
        console.error('설문 등록 실패:', err);
        return res.status(500).json({
            success: false,
            message: '설문 등록 중 오류가 발생했습니다.',
            error: err.message,
        });
    }
};





// 모든 제품 조회
exports.getAllSurvey = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: '토큰이 없습니다.' });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
  
      // ✅ order 순서대로 정렬, 없으면 createdAt 기준
      const survey = await Survey.find().sort({ order: 1, createdAt: -1 });
  
      if (!survey || survey.length === 0) {
        return res.status(404).json({ success: false, message: '설문을 찾을 수 없습니다.' });
      }
  
      res.status(200).json({
        success: true,
        totalSurvey: survey.length,
        survey: survey,
      });
    } catch (err) {
      console.error('모든 설문 조회 실패:', err);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  };
  exports.getSurveyById = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: '유효하지 않은 설문 ID입니다.' });
      }
  
      const survey = await Survey.findById(id);
  
      if (!survey) {
        return res.status(404).json({ success: false, message: '설문을 찾을 수 없습니다.' });
      }
  
      return res.status(200).json({ success: true, survey });
    } catch (err) {
      console.error('설문 조회 중 오류:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  };
  

  exports.getSurvey = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: '로그인 정보가 없습니다.' });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;
  
      const surveys = await Survey.find({ userId }).sort({ createdAt: -1 });
  
      return res.status(200).json({ success: true, surveys });
    } catch (err) {
      console.error('내 설문 조회 중 오류:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  };

exports.deleteSurvey = async (req, res) => {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "로그인 정보가 없습니다." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // 1️⃣ 제품 조회
        const survey = await Survey.findById(id);
        if (!survey) {
            return res.status(404).json({ success: false, message: "제품을 찾을 수 없습니다." });
        }
        // 4️⃣ 제품 데이터 삭제
        await Survey.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "제품이 삭제되었습니다." });
    } catch (err) {
        console.error("❌ 제품 삭제 중 오류 발생:", err);
        return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
};


// 제품 수정
exports.updateSurvey = async (req, res) => {
    const { id } = req.params;
    const { name,type, questions,isRequired, createdAt} = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: '로그인 정보가 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const survey = await Survey.findById(id);
        if (!survey) {
            return res.status(404).json({ success: false, message: '제품을 찾을 수 없습니다.' });
        }

        survey.name = name;
        survey.type = type,
        survey.isRequired = isRequired,
        survey.questions = questions,
        survey.createdAt = createdAt;

      

        await survey.save();

        return res.status(200).json({ success: true, message: '제품이 수정되었습니다.' });
    } catch (err) {
        console.error('제품 수정 중 오류 발생:', err);
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

exports.updateSurveyOrder = async (req, res) => {
    const { surveys } = req.body; // [{ id: '...', order: 0 }, { id: '...', order: 1 }, ...]
  
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: '로그인 정보가 없습니다.' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
  
      // survey 리스트 순회하면서 order 필드 업데이트
      for (const { id, order } of surveys) {
        await Survey.findByIdAndUpdate(id, { order });
      }
  
      return res.status(200).json({ success: true, message: '설문 순서가 업데이트되었습니다.' });
    } catch (err) {
      console.error('설문 순서 업데이트 중 오류 발생:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  };



