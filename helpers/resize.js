const Jimp = require("jimp");

const resize = async (filePath) => {
  Jimp.read(filePath)
    .then((file) => {
      return file.resize(250, 250).write(filePath);
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = resize;
