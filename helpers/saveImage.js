
module.exports = {
    /**
     * @description Save image in specific folder
     * @param {string} image64
     * @param {string} directory
     * @return Image Path
    **/
    saveImage: async (image64, dir, fileName) => {
        const fs = require("fs");
        const fsPromise = fs.promises;
        const path = require('path');
        const errors = [];
        let directory = dir;
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        // let name = Date.now() + data.extname;
        let name = fileName + ".png";
        let filepath = path.join(directory, name);
        await fsPromise.writeFile(filepath, image64, { encoding: 'base64' }, function (err) {
            if (err) {
                errors.push("هناك خطأ في الصورة التي تم تحميلها");
            }
        });
        if(errors.length > 0) {
            return {
                status: false,
                errors,
            };
        }
        return name;
    }
}