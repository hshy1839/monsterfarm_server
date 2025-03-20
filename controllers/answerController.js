const { Answer } = require("../models/Answer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'jm_shoppingmall';

exports.createAnswers = async (req, res) => {
  try {
    // 🔥 토큰 검증
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ success: false, message: "토큰이 필요합니다." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "유효하지 않거나 만료된 토큰입니다." });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "토큰에 userId가 없습니다." });
    }

    const userId = decoded.userId; // 🔥 토큰에서 유저 ID 가져오기
    const { surveyId, answers } = req.body;

    // 🔥 필수 값 검증
    if (!surveyId || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "surveyId와 answers가 필요합니다." });
    }

    // 🔥 answers 배열 검사 (객관식/주관식 유효성 체크)
    const formattedAnswers = answers.map(answer => ({
      name: answer.name,
      selectedOption: answer.selectedOption || "", // 객관식 선택지
      writtenAnswer: answer.writtenAnswer || "",  // 주관식 응답
    }));

    // 🔥 응답 저장
    const newAnswer = new Answer({ surveyId, userId, answers: formattedAnswers });
    const savedAnswer = await newAnswer.save();

    return res.status(200).json({
      success: true,
      message: "응답이 성공적으로 저장되었습니다.",
      answer: savedAnswer,
    });
  } catch (error) {
    console.error("응답 저장 오류:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류 발생",
      error: error.message,
    });
  }
};
