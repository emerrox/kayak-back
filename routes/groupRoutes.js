// routes/groupRoutes.js
const express = require('express');
const groupController = require('../controllers/groupController');
const router = express.Router();

router.get('/', groupController.getAllGroups);
router.post('/', groupController.createGroup);

module.exports = router;
