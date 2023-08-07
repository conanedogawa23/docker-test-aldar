const express = require('express');
const ImageMetadataController = require('../controller/image.controller');

const router = express.Router();
const imageMetadataController = new ImageMetadataController();

router.use('/metadata', imageMetadataController.router);

module.exports = router;
