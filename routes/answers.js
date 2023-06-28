var express = require('express');
var router = express.Router();
const db = require("../model/helper");

/* GET roomie answers. */
router.get('/', async function(req, res, next) {
  try {
   const result = await db("SELECT * FROM answers");
   res.send(result.data)
  } catch(err){
    res.status(500).send(err);
  }
});

// add a new prompt
router.post("/", async function(req, res, next) {
  const { roomieID, question, answer } = req.body;

  try {
    await db(`INSERT INTO answers (roomieID, question, answer)
    VALUES ('${roomieID}', '${question}', '${answer}')`);
    res.send({message: "answer was saved"})
  } catch(err) {
    res.status(500).send({message: err})
  }

})

//get the answers by roomie ID
router.get("/:roomieID", async function(req, res, next) {
  //your code here
  const { roomieID } = req.params;
  try {
    const result = await db(`SELECT * FROM answers WHERE roomieID = ${roomieID}`);
    res.send(result.data)
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

//delete an answer 
router.delete("/:answerID",  async function(req, res, next) {
  const { answerID } = req.params;
  try {
    await db(`DELETE FROM answers WHERE answerID = ${answerID}`);
    res.send({ message: "answer was deleted!" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
