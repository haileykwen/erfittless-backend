const express   = require('express');
const router    = express.Router();
const { Signup, Signin } = require('../controllers/auth.controller');

router.post("/signup", Signup);
router.post("/signin", Signin);

module.exports = router;