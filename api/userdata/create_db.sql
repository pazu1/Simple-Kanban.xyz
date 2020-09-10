--TODO: rename columns to something more consistent
CREATE TABLE k_user(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30)
);

CREATE TABLE project(
    project_id SERIAL PRIMARY KEY, 
    project_name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES k_user(user_id)
);

CREATE TABLE k_column(
    k_column_id SERIAL PRIMARY KEY, 
    title VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    index INT, --visual order of columns on client side
    project_id INT NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES k_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id)
    REFERENCES project(project_id) ON DELETE CASCADE
);

CREATE TABLE card(
    card_id SERIAL, 
    description VARCHAR(255) NOT NULL,
    k_column_id INT NOT NULL, 
    k_index INT, --visual order of cards on client side
    k_priority SMALLINT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (card_id),
    FOREIGN KEY(project_id)
    REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY(k_column_id)
    REFERENCES k_column(k_column_id) ON DELETE CASCADE
);

