const express = require('express');
const { 
    loginUser, 
    signupUser, 
    getAllUsersInfo , 
    updateUserInfo,
    deleteUser,
    getUserInfo,
    getUserInfoByid,
    loginAdmin,
    updateIsActive,
    changePassword,
    getInactiveUsersCount,
    signupAdmin,
} = require('../controllers/userController');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/admin/'); // 저장 경로
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    },
  });
  const upload = multer({ storage });

// 디버깅 로그 추가: 요청 경로 확인
router.use((req, res, next) => {
    next();
});
// 로그인
router.post('/login', loginUser);
router.post('/loginAdmin', loginAdmin);
// 회원가입
router.post('/signup', signupUser);

router.post('/signup/admin', upload.fields([
    { name: 'businessRegFile', maxCount: 1 },
    { name: 'bankCopyFile', maxCount: 1 },
  ]), signupAdmin);
//모든 유저 정보 조회
router.get('/userinfo', getAllUsersInfo );
//아이디를 통해 유저 조회
router.get('/userinfoget', getUserInfo );
//유저 정보 조회
router.get('/userinfo/:id',  getUserInfoByid);
//유저 수정
router.put('/userinfo/:id', updateIsActive );
router.get('/inactiveUsersCount', getInactiveUsersCount);
router.put('/changePassword', changePassword);
router.put('/userinfoUpdate', updateUserInfo );
//유저 삭제
router.delete('/userinfo/:id', deleteUser );

router.get('/download/:type/:filename', (req, res) => {
  const { type, filename } = req.params;

  let folder = '';
  if (type === 'business' || type === 'bank') {
    folder = 'admin';
  } else {
    return res.status(400).send('잘못된 요청입니다.');
  }

  const filePath = path.join(__dirname, `../uploads/${folder}/${filename}`);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('파일을 찾을 수 없습니다.');
  }
});

module.exports = router;
