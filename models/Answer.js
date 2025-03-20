const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true }, // 해당 설문 ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 응답한 유저 ID (로그인 필요 시)
  answers: [
    {
      name: { type: String, required: true }, // 질문 내용 (Survey 모델과 일치)
      selectedOption: { type: String, default: "" }, // 객관식일 경우 선택된 옵션
      writtenAnswer: { type: String, default: "" }, // 주관식일 경우 입력된 답변
    }
  ],
  createdAt: { type: Date, default: Date.now }, // 응답 제출 시간
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = { Answer };
