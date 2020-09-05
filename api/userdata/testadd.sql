
INSERT INTO project (project_name, user_id)
VALUES ('Test project', 1);

INSERT INTO k_column (title, user_id, project_id)
VALUES ('plan', 1, 1);

INSERT INTO k_column (title, user_id, project_id)
VALUES ('todo', 1, 1);

INSERT INTO k_column (title, user_id, project_id)
VALUES ('doing', 1, 1);

INSERT INTO k_column (title, user_id, project_id)
VALUES ('testing', 1, 1);

INSERT INTO k_column (title, user_id, project_id)
VALUES ('done', 1, 1);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('card 1', 0, 1, 1, 1);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('card 2', 1, 1, 1, 1);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('card 3', 2, 1, 1, 1);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('Todo',  0, 1, 1, 2);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('More todo', 1, 1, 1, 2);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('Todoasdf', 2, 1, 1, 2);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('card doing 1', 0, 1, 2, 3);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('card doing 2', 1, 1, 2, 3);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('card doing 3', 2, 1, 3, 3);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('Test card 1', 0, 1, 2, 4);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('Test card 2', 1, 1, 2, 4);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('Test card 3', 2, 1, 1, 4);

INSERT INTO card (description, k_index, project_id, k_priority, k_column_id)
VALUES ('done card', 0, 1, 1, 5);

