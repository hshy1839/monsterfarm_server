
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const connectDB = require('./db');

const userRoutes = require('./routes/userRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const answerRoutes = require('./routes/answerRoutes');

// CORS 설정 (여러 도메인 허용)
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^http:\/\/10\.0\.2\.2(:\d+)?$/,
  /^http:\/\/54\.180\.98\.3(:\d+)?$/,
  null, // origin이 null인 요청 허용 (Flutter 모바일 등)
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.some(regex => (typeof regex === 'string' ? regex === origin : regex?.test?.(origin)))) {
      callback(null, true);
    } else if (origin === null) {
      callback(null, true); // null origin 명시적으로 허용
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
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