var express = require("express");
var router = express.Router();
var db = require("../model/helper");
var fs = require("fs/promises");
var path = require("path");
const { v4: uuidv4 } = require("uuid");
const mime = require ("mime-types");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

async function getImages (req, res) {
  try {
    const results = await db("SELECT * FROM userimages;");
    res.send(results.data);
  } catch(err) {
    res.status(500).send(err);
  }
}

router.get("/", getImages);

router.post("/", upload.single("imagefile"), async (req, res) => {
  // files are available at req.files
  
  const imagefile  = req.file;
  console.log(imagefile);

  // check the exCannot destructure property 'imagefile' of 'req.files' as it is undefined.tension of the file
  const extension = mime.extension(imagefile.mimetype);

  // create a new random name for the file
  //randomly generated id . and the extension
  const filename = uuidv4() + "." + extension;

  // grab the filepath for the temporary file
  const tmp_path = imagefile.path;

  // construct the new path for the final file
  const target_path = path.join(__dirname, "../public/images/") + filename;

  try {
    // move the file from tmp folder to the public folder
    await fs.rename(tmp_path, target_path);

    // store image in the DB
    await db(`INSERT INTO userimages (path) VALUES ("${filename}");`);
    getImages(req, res);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async function(req, res) {
  const { id } = req.params;
  try {
    await db(`DELETE FROM userimages WHERE id = ${id}`);
    res.send({ message: "image was deleted!" });
  } catch (err) {
    res.status(500).send(err);
  }
})

module.exports = router;