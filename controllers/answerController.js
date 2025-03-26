const { Answer } = require("../models/Answer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'jm_shoppingmall';
const mongoose = require("mongoose");

exports.createAnswers = async (req, res) => {
  console.log('🔥 [createAnswers] 요청 들어옴');
  try {
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

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'answers are required' });
    }

    // surveyId가 없는 항목 제거
    const filteredAnswers = answers.filter(a => a.surveyId);

    if (filteredAnswers.length === 0) {
      return res.status(400).json({ success: false, message: 'Each answer must include a valid surveyId' });
    }

    // Answer 문서 생성
    const answerDoc = new Answer({
      userId: decoded.userId,
      answers: filteredAnswers.map(a => ({
        surveyId: a.surveyId,
        name: a.name,
        type: a.type,
        selectedOption: a.selectedOption || "",
        writtenAnswer: a.writtenAnswer || "",
      })),
    });

    const savedAnswer = await answerDoc.save();

    return res.status(200).json({
      success: true,
      message: "응답이 성공적으로 저장되었습니다.",
      answer: savedAnswer,
    });
  } catch (err) {
    console.error('응답 저장 실패:', err);
    return res.status(500).json({
      success: false,
      message: '응답 저장 중 오류가 발생했습니다.',
      error: err.message,
    });
  }
};

exports.getAllAnswers = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: '토큰이 없습니다.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const answer = await Answer.find();
        if (!answer || answer.length === 0) {
            return res.status(404).json({ success: false, message: '설문을 찾을 수 없습니다.' });
        }

        res.status(200).json({
            success: true,
            totalSurvey: answer.length,
            answer: answer,
        });
    } catch (err) {
        console.error('모든 설문 조회 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};
exports.getAnswer = async (req, res) => {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('유효하지 않은 답변 ID:', id);
        return res.status(400).json({ success: false, message: '유효하지 않은 답변 ID입니다.' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.error('토큰 누락: 인증 실패');
            return res.status(401).json({ success: false, message: '로그인 정보가 없습니다.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const answer = await Answer.findById(id);
        if (!answer) {
            console.error('답변 없음:', id);
            return res.status(404).json({ success: false, message: '답변을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ success: true, answer });

    } catch (err) {
        console.error('제품 조회 중 오류:', err);
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};