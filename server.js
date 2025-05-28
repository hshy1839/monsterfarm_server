
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const connectDB = require('./db');

const userRoutes = require('./routes/userRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const answerRoutes = require('./routes/answerRoutes');
const estimateRoutes = require('./routes/estimateRoutes');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS 설정 (여러 도메인 허용)
app.use(cors({
  origin: true,
  credentials: true,
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
app.use('/api', estimateRoutes);