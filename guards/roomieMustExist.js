const db = require("../model/helper");

async function roomieMustExist(req, res, next) {
  const { id } = req.params;
  try {
    const results = await db(`SELECT * FROM roomies WHERE id = ${id}`);
    if (results.data.length) {
      next();
    } else {
      res.status(404).send({ message: "roomie was not found" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = roomieMustExist;