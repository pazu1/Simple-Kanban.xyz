const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const pgp = require("pg-promise")();

const pool = require("../userdata/db").pool;
const pgpPool = require("../userdata/db").pgpPool;

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

router.get("/projects", async (req, res) => {
    try {
        const { user_id } = req.user;
        const allProjects = await pool.query(
            `
            SELECT project_id, project_name, k_columns
                FROM project pr 
                WHERE user_id = $1
            `,
            [user_id]
        );
        if (!allProjects.rows.length)
            return res.status(404).send("No projects found");

        res.send(allProjects.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get all cards for a project
router.get("/cards", async (req, res) => {
    try {
        const { user_id } = req.user;
        const { project_id } = req.query;
        const allCards = await pool.query(
            `
            SELECT cr.description, cr.card_id, cr.k_column , cr.k_index, cr.k_priority
                FROM project pr 
                INNER JOIN card cr ON cr.project_id = pr.project_id 
                AND pr.user_id = $1 AND pr.project_id = $2
            `,
            [user_id, project_id]
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
            `
            SELECT cr.description, cr.card_id, cr.k_column
                FROM project pr 
                INNER JOIN card cr ON cr.project_id = pr.project_id 
                WHERE pr.user_id = $1 AND cr.card_id = $2`,
            [user_id, id]
        );
        if (!card.rows.length)
            return res.status(404).send("The card was not found");
        res.send(card.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// update two columns of cards
router.put("/cards/", async (req, res) => {
    try {
        const { user_id } = req.user;
        const { columnA, columnB } = req.body;
        const updateData = columnA.concat(columnB).map((c) => {
            return { card_id: c.id, k_index: c.index, k_column: c.column };
        });
        const columnSet = new pgp.helpers.ColumnSet(
            ["?card_id", "k_index", "k_column"],
            { table: "card" }
        );
        const update =
            pgp.helpers.update(updateData, columnSet) +
            " WHERE v.card_id = t.card_id";
        console.log(update);
        pgpPool.none(update).then(() => {
            console.log("success");
        });
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
            "UPDATE cr.card " +
                "SET cr.description = $1 " +
                "FROM card cr INNER JOIN project pr " +
                "ON pr.project_id = cr.project_id " +
                "WHERE cr.card_id = $2 and pr.user_id = $3",
            [description, id, user_id]
        );
        res.send("Card was updated");
    } catch (err) {
        console.error(err.message);
    }
});

// add a card
router.post("/cards", async (req, res) => {
    try {
        const { user_id } = req.user;
        const project_id = parseInt(req.body.project_id);
        const { description, column, priority, index } = req.body;
        console.log(project_id, req.user, description);

        const canAddCard = await pool.query(
            `
            SELECT * FROM project pr 
            WHERE pr.user_id = $1 AND pr.project_id = $2 
            `,
            [user_id, project_id]
        );
        if (!canAddCard.rows.length) {
            return res.status(404).send("Project not found.");
        }
        const newCard = await pool.query(
            `
            INSERT INTO card (description, k_column, project_id, k_priority, k_index)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING description, k_column, card_id;
        `,
            [description, column, project_id, priority, index]
        );
        return res.send(newCard.rows[0]);
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
            `
            DELETE FROM card cr
            USING project pr
            WHERE cr.project_id = pr.project_id AND
            pr.user_id = $2 AND cr.card_id = $1
            RETURNING cr.card_id;
            `,
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
