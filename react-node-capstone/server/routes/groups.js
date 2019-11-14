var router = require("express").Router();
var pool = require("../db/database");
var bodyParser = require("body-parser");
var sqlHandler = require("../utils/sql-helper/sql-helper");
var emailhelper = require("../utils/email/email-sender");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Get Groups
router.route("/").get(async (req, res) => {
  try {
    let groups = await pool.query("SELECT * FROM groups");
    res.json(groups);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//Get Specific group info
router.route("/groupInfo/:group_id").get(async (req, res) => {
  try {
    let groupid = req.params.group_id;
    let group_info = await pool.query(
      "SELECT * FROM groups WHERE group_id =" + groupid + ";"
    );
    res.json(group_info);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//Get all group Members
router.route("/groupMembers/:group_id").get(async (req, res) => {
  try {
    let groupid = req.params.group_id;
    let group_members = await pool.query(
      "SELECT ui.user_id, ui.first_name, ui.last_name, ui.campusEmail, mg.status FROM user_info ui INNER JOIN  my_groups mg on ui.user_id = mg.user_id where mg.group_id = " +
        groupid +
        ";"
    );
    res.json(group_members);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//Broken. Needs to pull only single-event-layout for that group.
//Get all group events
router.route("/groupEvents/:group_id").get(async (req, res) => {
  try {
    let groupid = req.params.group_id;
    let group_events = await pool.query(
      "SELECT eventID, title, description, start, end FROM event WHERE group_id =" +
        groupid +
        ";"
    );
    res.json(group_events);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//Create a group with the user logged in
router.route("/").post((req, res) => {
  const groups = {
    group_name: req.body.group_name,
    creator_id: req.user.user_id
  };

  pool.query("INSERT INTO groups SET ?", groups, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    const my_groups = {
      user_id: req.user.user_id,
      group_id: results.insertId,
      status: "Owner"
    };
    pool.query("INSERT INTO my_groups SET ?", my_groups, function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      res.send(results);
    });
    res.send(results);
  });
});

//Delete a group
router.route("/delete/:group_id").delete(async (req, res) => {
  try {
    let group_id = req.params.group_id;
    pool.query("DELETE FROM my_groups WHERE group_id = ?", group_id, function(
      error,
      results,
      fields
    ) {
      if (error) {
        return res.json({ success: false, message: error });
      }
      let sql = "DELETE FROM groups WHERE group_id = " + group_id + ";";
      pool.query(sql, function(error, results, fields) {
        if (error) {
          return res.json({
            success: false,
            message: "Error while deleting the group"
          });
        } else {
          return res.json({
            success: true,
            message: "Your group has been deleted"
          });
        }
      });
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//Create a group event
router.route("/createEvents").post(async (req,res) =>{
  try{
    let creator_id = req.user.user_id;
    let group_id = req.body.group_id;
    let status = await pool.query("SELECT status FROM my_groups WHERE user_id =" + creator_id + " AND group_id = " + group_id + ";");
    if (status[0].status == "Owner"){
      let newEvent = {
      title: req.body.title,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      event_type: "group_event",
      creator_id: req.user.user_id,
      carousel: req.body.carousel,
      group_id: req.body.group_id,
      status: "approved"
      }
      pool.query("INSERT INTO event SET ?", newEvent, function(
        error,
        results,
        fields
      ){
        if (error) throw error;
        res.send(results);
      })
    }
    else {
      let newEvent = {
        title: req.body.title,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        event_type: "group_event",
        creator_id: req.user.user_id,
        carousel: req.body.carousel,
        group_id: req.body.group_id,
        status: "pending"
      }
      pool.query("INSERT INTO event SET ?", newEvent, function(
        error,
        results,
        fields
      ){
        if (error) throw error;
        res.send(results);
      })
    }
  
}
  catch(e){
    console.log(e);
    res.sendStatus(500);
  }
})
module.exports = router;
