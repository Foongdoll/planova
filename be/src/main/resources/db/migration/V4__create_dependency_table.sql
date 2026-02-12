CREATE TABLE dependencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    from_task_id BIGINT NOT NULL,
    to_task_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dep_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_dep_from_task FOREIGN KEY (from_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_dep_to_task FOREIGN KEY (to_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT uk_dep_from_to UNIQUE (from_task_id, to_task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
