const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  name: { type: String, required: true }, // 설문 제목
  type: { type: String, enum: ["객관식", "주관식"], required: true }, // 설문 타입
  questions: [
    {
      questionText: { type: String, required: true }, // 문제 내용
      options: { type: [String], default: [] }, // 객관식일 경우 선택지
    }
  ],
  createdAt: { type: Date, default: Date.now }, // 설문 생성 시간
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = { Survey };
