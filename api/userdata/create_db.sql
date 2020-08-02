CREATE TYPE k_state AS ENUM ('todo', 'doing', 'done');

CREATE TABLE card(
    card_id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    current_state k_state NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id)
    REFERENCES k_user(user_id)
);

CREATE TABLE k_user(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30)
);

