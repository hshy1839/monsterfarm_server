const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 응답한 유저 ID
  answers: [
    {
      surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true }, // 해당 설문 ID
      name: { type: String, required: true }, // 질문 내용
      type: { type: String, required: true }, // 🔥 객관식/주관식 구분
      selectedOption: { type: String, default: "" }, // 객관식일 경우 선택된 옵션
      writtenAnswer: { type: String, default: "" }, // 주관식일 경우 입력된 답변
    }
  ],
  createdAt: { type: Date, default: Date.now }, // 응답 제출 시간
  expiresAt: {                                      // ✅ 7일 후 만료일
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 현재 시간 + 7일
  }
});

// ✅ TTL 인덱스 설정 (expiresAt 기준으로 문서 자동 삭제)
answerSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Answer = mongoose.model("Answer", answerSchema);

module.exports = { Answer };
