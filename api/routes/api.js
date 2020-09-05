const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const pgp = require("pg-promise")();

const db = require("../userdata/db");
const pool = db.pool;

// TODO: test API for errors, make sure all cases are covered
//       psql triggers

//
// Authorization
//

// This is to be a strong password that is only stored in the server
const jwtSecret = "secret";

class Response {
    constructor(success = false, message, content = null) {
        this.success = success;
        this.message = message;
        this.content = content;
    }
}

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
    console.log("user id", user_id);

    const token = jsonwebtoken.sign({ user_id: user_id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.json({ token });
});

router.use(
    // TODO: Mount error handler as middleware (?)
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
});

router.get("/projects", (req, res) => {
    useErrorHandler(async () => {
        const { user_id } = req.user;
        const allProjects = await pool.query(
            `
            SELECT pr.project_id, pr.project_name, kc.title, kc.k_column_id
                FROM project pr INNER JOIN k_column kc
                ON pr.user_id = 1 AND kc.user_id = 1;
            `,
            [user_id]
        );
        if (!allProjects.rows.length) throw new Error("No projects found.");
        return res.json(
            new Response(true, "Projects retrieved.", allProjects.rows)
        );
    }, res)();
});

// get all cards for a project
router.get("/cards", (req, res) => {
    useErrorHandler(async () => {
        const { user_id } = req.user;
        const { project_id } = req.query;
        const allCards = await pool.query(
            `
            SELECT cr.description, cr.card_id, cr.k_column_id , cr.k_index, cr.k_priority
                FROM project pr 
                INNER JOIN card cr ON cr.project_id = pr.project_id 
                AND pr.user_id = $1 AND pr.project_id = $2
            `,
            [user_id, project_id]
        );
        if (!allCards.rows.length) throw new Error("No cards found.");
        return res.json(new Response(true, "Cards retrieved.", allCards.rows));
    }, res)();
});

// get a card
router.get("/cards/:id", (req, res) => {
    useErrorHandler(async () => {
        const { user_id } = req.user;
        const { id } = req.params;
        const card = await pool.query(
            `
                SELECT cr.description, cr.card_id, cr.k_column_id
                    FROM project pr 
                    INNER JOIN card cr ON cr.project_id = pr.project_id 
                    WHERE pr.user_id = $1 AND cr.card_id = $2`,
            [user_id, id]
        );
        if (!card.rows.length) throw new Error("Card not found.");
        return res.json(new Response(true, "Retrieved card", card.rows));
    }, res)();
});

// update two columns of cards or a single if only one provided
router.put("/cards/", (req, res) => {
    useErrorHandler(async () => {
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
            `
                WHERE v.card_id = t.card_id
                AND t.project_id IN (
                    SELECT project_id FROM project
                    WHERE user_id = $1
                )
                `;
        return pool
            .query(update, [user_id]) // TODO: use this pattern: return a promise
            .then(() => {
                return res.json(new Response(true, "Columns updated."));
            });
    }, res)();
});

//  update a card
router.put("/cards/:id", (req, res) => {
    useErrorHandler(async () => {
        const { user_id } = req.user;
        const { id } = req.params; // Where to update
        const { description, priority } = req.body; // What is to be updated
        return pool
            .query(
                `
            UPDATE card AS c1
            SET description = $1, k_priority = $2
            FROM project pr 
            WHERE c1.card_id = $3 
            AND c1.project_id = pr.project_id 
            AND pr.user_id = $4
            `,
                [description, priority, id, user_id]
            )
            .then(() => {
                return res.json(new Response(true, "Card updated."));
            });
    }, res)();
});

// add a card
router.post("/cards", (req, res) => {
    useErrorHandler(async () => {
        const { user_id } = req.user;
        const project_id = parseInt(req.body.project_id);
        const { description, column, priority, index } = req.body;

        const canAddCard = await pool.query(
            // TODO: make this into one single query
            `
            SELECT * FROM project pr 
            WHERE pr.user_id = $1 AND pr.project_id = $2 
            `,
            [user_id, project_id]
        );
        if (!canAddCard.rows.length) {
            throw new Error("Could not add card.");
        }
        return pool
            .query(
                `
            INSERT INTO card (description, k_column, project_id, k_priority, k_index)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING card_id;
        `,
                [description, column, project_id, priority, index]
            )
            .then((newCard) => {
                return res.json(
                    new Response(true, "Card added.", newCard.rows[0])
                );
            });
    }, res)();
});

// delete a card
router.delete("/cards/:id", (req, res) => {
    useErrorHandler(async () => {
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
        if (!deleteCard.rows.length) {
            throw new Error("Could not delete card.");
        }

        return res.json(new Response(true, "Card was deleted."));
    }, res)();
});

//  update array of column names
router.put("/projects/columns", (req, res) => {
    useErrorHandler(async () => {
        const { user_id } = req.user;
        const { newColumns, project_id, deleted } = req.body;

        return pool
            .query(
                `
                UPDATE project AS p
                SET k_columns = $1
                WHERE p.project_id = $2
                AND p.user_id = $3
                RETURNING p.project_id;
            `,
                [newColumns, project_id, user_id]
            )
            .then((qRes) => {
                console.log(qRes);
                if (deleted.length && qRes.rowCount) {
                    const authorizedProjectId = qRes.rows[0].project_id;
                    pool.query(
                        `DELETE FROM card WHERE k_column = ANY($1)
                        AND project_id = $2`,
                        [deleted, authorizedProjectId]
                    );
                }
            })
            .then(() => {
                return res.json(new Response(true, "Card updated."));
            });
    }, res)();
});

var useErrorHandler = function (f, res) {
    return function () {
        return f.apply(this, arguments).catch((err) => {
            console.error("THREAD CATCH", err.message);
            return res.status(400).json(new Response(false, err.message));
        });
    };
};

module.exports = router;
