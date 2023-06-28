var express = require('express');
var router = express.Router();
const db = require("../model/helper");
const roomieMustExist = require("../guards/roomieMustExist");


//get list of roomies 
router.get("/", async function getRoomiesList(req, res, next) {
  try {
    const result = await db("SELECT * FROM roomies;");
    res.send(result.data);
    console.log(result);
  } catch(err) {
    res.status(500).send(err);
  }
});

//find a roomie by location 
router.get(`/search`, async function(req, res, next) {
  //your code here
  const queryParams = req.query;
  const conditions = [];
  
  //Check for the distance paramerters
  if (queryParams.latitude && queryParams.longitude) {
    const placeCondition = `ST_DISTANCE_SPHERE(POINT(${queryParams.longitude}, ${queryParams.latitude}),
    POINT(longitude, latitude)) <= 10000`
    conditions.push(placeCondition);
  }

  //Check for budget parameters
  if (queryParams.maxbudget) {
    const budgetCondition = `maxbudget >= ${queryParams.maxbudget}`
    conditions.push(budgetCondition);
  }
//Join the conditions. If the array is empty, the whereClause is an empty string. Multiple conditions are joined by
//the AND
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  //create a variable for the MySQL query 
  const query = `SELECT * FROM roomies ${whereClause}`


  
  try {
    const result = await db(query);
    // console.log(result)
    res.send(result.data)
  } catch(err) {
    res.send(err);
  }
});



//get one roomie 
router.get("/:id", roomieMustExist, async function(req, res, next) {
  //your code here
  const { id } = req.params;
  try {
    const result = await db(`SELECT * FROM roomies WHERE id = ${id}`);
    res.send(result.data[0])
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

//add new roomie 
router.post("/", async function(req, res, next) {
  //your code here
  const { firstname, lastname, bio, age, ocupation, locationname, latitude, longitude, maxbudget, smoke, has_pets } = req.body;

  try {
    await db(
      `INSERT INTO roomies (firstname, lastname, bio, age, ocupation, locationname, latitude, longitude, maxbudget, smoke, has_pets) VALUES ('${firstname}', '${lastname}', '${bio}', '${age}', '${ocupation}', '${locationname}', '${latitude}', '${longitude}', '${maxbudget}', '${smoke}', '${has_pets}')`
    );
    res.send({ message: "roomie was added to database" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

//delete a roomie 
router.delete("/:id", roomieMustExist, async function(req, res, next) {
  const { id } = req.params;
  try {
    await db(`DELETE FROM roomies WHERE id = ${id}`);
    res.send({ message: "Roomie was deleted!" });
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;
