const path = require("path");
const multer = require("multer");

const tempPath = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempPath,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

module.exports = upload;
