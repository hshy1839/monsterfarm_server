const mongoose = require('mongoose');
const { Schema } = mongoose;

const estimateSchema = new Schema({
  surveyId: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // 대리점 대표 유저
    required: true,
  },
  images: [
    {
      type: String, // 파일 경로 또는 URL
      required: true,
    },
  ],
  selectedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // 선택한 고객 (null이면 미선택)
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Estimate', estimateSchema);
