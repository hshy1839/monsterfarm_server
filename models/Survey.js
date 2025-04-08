const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  name: { type: String, required: true }, // 설문 제목
  type: { type: String, enum: ["객관식", "주관식"], required: true }, // 설문 타입 (전체 설문용)
  isRequired: { type: Boolean, required: true },
  questions: [
    {
      questionText: { type: String, required: true }, // 질문 내용
      type: { type: String, enum: ["객관식", "주관식"], required: true }, // ✅ 각 질문의 타입
      options: { type: [String], default: [] }, // 객관식일 경우 선택지
    }
  ],
  createdAt: { type: Date, default: Date.now },
  order: Number,
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = { Survey };
