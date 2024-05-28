const express = require('express');
const router = express.Router();

router.use('/auth', require('../controller/auth/index'));
router.use('/uploadID', require('../controller/uploadID/index'));
router.use('/person', require('../controller/personOfConcern/index'));

module.exports = router;