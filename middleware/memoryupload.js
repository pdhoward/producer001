const multer = require('multer');
const uuid = require('uuid');

const MIME_TYPE_MAP ={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
};

const fileFilter = (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type');           
    cb(error, isValid);
}

const memoryUpload = multer({   
    storage: multer.memoryStorage(),
    fileFilter: fileFilter
});

module.exports = memoryUpload;
