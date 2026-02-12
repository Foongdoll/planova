package com.foongdoll.portfolio.planovabe.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dependencies")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Dependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_task_id", nullable = false)
    private Task fromTask;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_task_id", nullable = false)
    private Task toTask;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
