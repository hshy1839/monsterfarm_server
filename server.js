
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const connectDB = require('./db');

const userRoutes = require('./routes/userRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const answerRoutes = require('./routes/answerRoutes');

// CORS 설정 (여러 도메인 허용)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      /^http:\/\/localhost(:\d+)?$/,
      /^http:\/\/127\.0\.0\.1(:\d+)?$/,
      /^http:\/\/10\.0\.2\.2(:\d+)?$/,
    ];
    if (!origin || allowedOrigins.some(regex => regex.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS 추가
  credentials: true, // 인증 정보 포함 허용
  allowedHeaders: 'Content-Type, Authorization' // 허용된 헤더 지정
}));


app.use(express.json());


app.listen(7777, () => {
  console.log('listening to http://localhost:7777');
});

connectDB();
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api', surveyRoutes);
app.use('/api', answerRoutes);