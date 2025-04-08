const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://sgs527:Mu69J85xMyMBDtCr@monsterfarm.xmk81.mongodb.net/?retryWrites=true&w=majority&appName=Monsterfarm'

const connectDB = async () => {
  try {
    mongoose.connect(MONGO_URI, {
      
      tlsInsecure: true, // SSL/TLS 문제 해결
      family: 4,         // IPv4 강제 사용
    });
    
    
    console.log('MongoDB Atlas 연결 성공!');
  } catch (err) {
    console.error('MongoDB Atlas 연결 실패:', err);
  }
};

module.exports = connectDB;