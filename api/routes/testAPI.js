var express = require("express");
var router = express.Router();
const pool = require("../userdata/db");

router.use(express.json()); // => req.body

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

// get all cards
router.get("/cards", async (req, res) => {
    try {
        const allCards = await pool.query("SELECT * FROM card ");
        if (!allCards.rows.length)
            return res.status(404).send("No cards found");

        res.send(allCards.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get a card
router.get("/cards/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const card = await pool.query(
            "SELECT description, current_state FROM card " +
                "WHERE card_id = $1",
            [id]
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
        const { id } = req.params; // Where to update
        const { description } = req.body; // What is to be updated
        const newCard = await pool.query(
            "UPDATE card SET " + "description = $1 WHERE card_id = $2",
            [description, id]
        );
        res.send("Card was updated");
    } catch (err) {
        console.error(err.message);
    }
});

// create a card
router.post("/cards", async (req, res) => {
    try {
        const { description } = req.body;
        const state = "todo";
        const newCard = await pool.query(
            "INSERT INTO card (description, current_state) VALUES ($1,$2) "+
            "RETURNING description, current_state",
            [description, state]
        );
        res.send(newCard.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// delete a card
router.delete("/cards/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCard = await pool.query(
            "DELETE FROM card WHERE card_id = $1 RETURNING card_id",
            [id]
        );
        if (!deleteCard.rows.length)
            return res.status(404).send("The card was not found");

        res.send("Card was deleted.");
    } catch (err) {
        console.log("ERR");
        console.error(err.message);
    }
});

module.exports = router;
