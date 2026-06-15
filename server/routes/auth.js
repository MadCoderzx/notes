const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', auth, getProfile);

module.exports = router;
