INSERT INTO project (project_name, user_id, k_columns)
VALUES ('Test project', 1, ARRAY [ 'plan', 'todo', 'doing', 'testing', 'done' ]);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('card 1', 'plan', 0, 1, 1);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('card 2', 'plan', 1, 1, 1);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('card 3', 'plan', 2, 1, 1);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('Todo', 'todo', 0, 1, 1);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('More todo', 'todo', 1, 1, 1);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('Todoasdf', 'todo', 2, 1, 1);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('card doing 1', 'doing', 0, 1, 2);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('card doing 2', 'doing', 1, 1, 2);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('card doing 3', 'doing', 2, 1, 3);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('Test card 1', 'testing', 0, 1, 2);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('Test card 2', 'testing', 1, 1, 2);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('Test card 3', 'testing', 2, 1, 1);

INSERT INTO card (description, k_column, k_index, project_id, k_priority)
VALUES ('done card', 'done', 0, 1, 1);

