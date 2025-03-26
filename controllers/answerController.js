const { Answer } = require("../models/Answer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'jm_shoppingmall';

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
