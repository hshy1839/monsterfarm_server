const mongoose = require('mongoose');
const { Schema } = mongoose;

const estimateItemSchema = new Schema({
  category: { type: String, required: true },         // 액제살포장치 등 선택 항목
  productName: { type: String, required: false },     // 직접입력 가능
  quantity: { type: Number, required: false },
  note: { type: String },                              // 비고
});

const estimateSchema = new Schema({
answerId: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  manufacturer: { type: String, required: true },          // 드론 제조 회사 명
  price: { type: Number, required: true },                 // 견적 금액
  droneBaseName: { type: String },                         // 드론 기종 명
  items: [estimateItemSchema],                             // 항목들
  selectedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Estimate', estimateSchema);
