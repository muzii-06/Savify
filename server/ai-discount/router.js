const express = require('express');
const router = express.Router();
const { runDiscountModel } = require('./controller');

router.post('/negotiate', runDiscountModel);


module.exports = router;
