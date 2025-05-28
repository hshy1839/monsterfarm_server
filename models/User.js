const mongoose = require("mongoose");
const saltRounds = 10;
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_type: { type: String, default: "3" },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: false },
    cropType: {
      type: String,
      enum: ['수도작', '밭작물', '과수', '기타', '농사 짓지 않음'],
      required: false
    },
    customCrop: { type: String, required: false },
  
    // ✅ 사업자 정보 관련 필드 추가
    companyName: { type: String, required: false },              // 회사명
    businessRegistrationFile: { type: String, required: false }, // 사업자등록증 파일 경로
    bankbookFile: { type: String, required: false },              // 통장 사본 파일 경로,
    is_active : {type:Boolean, default: true}
  }, { timestamps: true });
  

// 비밀번호 암호화
userSchema.pre("save", function (next) {
    const user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// 비밀번호 비교 메소드
userSchema.methods.comparePassword = function (candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
