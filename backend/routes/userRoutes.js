const express = require('express');
const router = express.Router();
const { getProfile } = require('../controller/userController');

// Get user profile
router.get('/:id', getProfile);

module.exports = router;