const router = require("express").Router();
const sqlHandler = require("../utils/sql-helper/sql-helper");
const pool = require("../db/database");
const bodyParser = require("body-parser");
const authMiddleware = require("../middlewares/auth-middleware").authMiddleware;
const emailUtils = require("../utils/email/email-utils");
const socket = require("../utils/socket/socket");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(authMiddleware);


router.post("/", (req, res, next) => {

    let calendarId = req.body.calendarId;

    const appointment = {
        title: req.body.title,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        event_type: "appointment",
        creator_id: req.user.user_id,
        carousel: req.body.carousel || "1",
    };

    if (("" + calendarId) !== "main" && ("" + calendarId).length > 0) {
        appointment.creator_calendar_id = calendarId;
    }

    pool.query("INSERT INTO event SET ?", appointment, async function (error, results, fields) {

        if (error) {
            return next(error);
        }

        let eventId = results.insertId;

        if (req.body.attendeeEmails) {

            const emailList = req.body.attendeeEmails;

            await emailList.forEach(async (email) => {

                await pool.query("SELECT user_id FROM user_info WHERE campusEmail = ?", email, function (error, results, fields) {

                    if (error) {
                        return next(error);
                    }
                    const inviteData = {
                        event_id: eventId,
                        invited_user_id: results[0].user_id
                    };

                    appointment.eventID = eventId;
                    socket.broadcastToUser(inviteData.invited_user_id, "newEventInvite", appointment);

                    pool.query("INSERT INTO event_invite SET ?", inviteData, (err, results, fields) => {
                        if (err) {
                            return next(err);
                        }
                    });
                });
            });
            return res.json({success: true});
        }
    });
});


router.post("/delete", (req, res, next) => {

    pool.query("DELETE FROM event WHERE eventID = ?", req.body.eventId, function (error, results, fields) {

        if (error) {
            return next(error);
        }

        return res.json({success: true});

    });


});


router.post("/attend", function (req, res, next) {

    const attendeeData = {
        event_id: req.body.eventId,
        attendee_id: req.user.user_id,
        calendar_id: null
    };

    pool.query("SELECT * FROM event WHERE eventID = ?", attendeeData.event_id, function (error, results, fields) {

        if (error) {
            return next(error);
        }

        const attendingEvent = results[0];

        const creatorData = {
            event_id: req.body.eventId,
            attendee_id: results[0].creator_id,
        };
        let calendarId = results[0].creator_calendar_id;
        if (("" + calendarId) !== "main" && ("" + calendarId).length > 0) {
            creatorData.calendar_id = calendarId;
        }

        socket.broadcastToUser(creatorData.attendee_id, "newAttendingEvent", attendingEvent);
        socket.broadcastToUser(attendeeData.attendee_id, "newAttendingEvent", attendingEvent);

        pool.query("INSERT INTO attending SET ?", attendeeData, function (error, results, fields) {

            if (error) {
                return next(error);
            }

            pool.query("DELETE FROM event_invite WHERE event_id = ?", req.body.eventId, function (error, results, fields) {
                if (error) {
                    return next(error);
                }

                pool.query("INSERT INTO attending SET ?", creatorData, function (error, results, fields) {
                    if (error) {
                        return next(error);
                    }
                    return res.json({success: true});
                });
            });
        });
    });
});

router.get("/receivedInvite", function (req, res) {

    let select = "SELECT * FROM event INNER JOIN event_invite ON event_id = eventID WHERE invited_user_id = " + req.user.user_id;

    sqlHandler.handleSelectAndRespond(select, res);
});


module.exports = router;