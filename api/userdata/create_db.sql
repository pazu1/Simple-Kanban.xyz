CREATE TABLE k_user(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30)
);

CREATE TABLE project(
    project_id SERIAL PRIMARY KEY, 
    project_name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    k_columns TEXT [],
    FOREIGN KEY (user_id)
    REFERENCES k_user(user_id)

);

CREATE TABLE card(
    card_id SERIAL, 
    description VARCHAR(255) NOT NULL,
    k_column VARCHAR(100) NOT NULL, 
    k_index INT, --visual order of cards on client side
    k_priority SMALLINT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (card_id),
    FOREIGN KEY(project_id)
    REFERENCES project(project_id)
);

