CREATE TYPE k_state AS ENUM ('todo', 'doing', 'done');

CREATE TABLE card(
    card_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    current_state k_state NOT NULL
);
