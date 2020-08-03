const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");

const pool = require("../userdata/db");

// XXX = only for testing/unsafe => delete
// TODO: add validation for incoming requests

//
// Authorization
//

// This is to be a strong password that is only stored in the server
const jwtSecret = "secret";

router.get("/jwt", async (req, res) => {
    // Handle on user already has access token
    if (req.cookies.token) {
        return res.send(
            "Requested token cookie, but the client already has one."
        );
    }

    // User first time access -> add user to database
    const newUser = await pool.query(
        "INSERT INTO k_user (user_id) VALUES (DEFAULT) RETURNING user_id"
    );

    const user_id = newUser.rows[0].user_id;
    console.log(user_id);

    const token = jsonwebtoken.sign({ user_id: user_id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.json({ token });
});

router.use(
    jwt({
        secret: jwtSecret,
        getToken: (req) => req.cookies.token,
        algorithms: ["HS256"],
    })
);

//
// API for accessing user data
//

router.get("/", (req, res) => {
    res.send("API is accessible");
    console.log(req.user);
});

// get all cards owned by user
router.get("/cards", async (req, res) => {
    try {
        const { user_id } = req.user;
        const allCards = await pool.query(
            "SELECT cr.description, cr.card_id, cr.current_state " +
                "FROM k_user ku " +
                "INNER JOIN card cr ON cr.user_id = ku.user_id " +
                "WHERE ku.user_id = $1",
            [user_id]
        );
        if (!allCards.rows.length)
            return res.status(404).send("No cards found");

        res.send(allCards.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get a card
router.get("/cards/:id", async (req, res) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const card = await pool.query(
            "SELECT cr.description, cr.card_id, cr.current_state " +
                "FROM k_user ku " +
                "INNER JOIN card cr ON cr.user_id = ku.user_id " +
                "WHERE ku.user_id = $1 AND cr.card_id = $2"[(user_id, id)]
        );
        if (!card.rows.length)
            return res.status(404).send("The card was not found");
        res.send(card.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//  update a card
router.put("/cards/:id", async (req, res) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params; // Where to update
        const { description } = req.body; // What is to be updated
        const newCard = await pool.query(
            "UPDATE card SET " +
                "description = $1 " +
                "WHERE card_id = $2 AND user_id = $3",
            [description, id, user_id]
        );
        res.send("Card was updated");
    } catch (err) {
        console.error(err.message);
    }
});

// create a card
router.post("/cards", async (req, res) => {
    try {
        const { user_id } = req.user;
        const { description } = req.body;
        const state = "todo";
        const newCard = await pool.query(
            "INSERT INTO card (description, current_state, user_id) " +
                "VALUES ($1,$2, $3) " +
                "RETURNING description, current_state",
            [description, state, user_id]
        );
        res.send(newCard.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// delete a card
router.delete("/cards/:id", async (req, res) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const deleteCard = await pool.query(
            "DELETE FROM card " +
                "WHERE card_id = $1 AND user_id = $2 " +
                "RETURNING card_id",
            [id, user_id]
        );
        if (!deleteCard.rows.length)
            return res.status(404).send("The card was not found");

        res.send("Card was deleted.");
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
