import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Tournament } from "../tournaments/tournament.entity";

export enum TeamStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

@Entity()
export class Team {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    logoUrl?: string;

    @Column({ nullable: true })
    captainName?: string;

    @Column({ nullable: true })
    contactEmail?: string;

    @Column({
        type: "enum",
        enum: TeamStatus,
        default: TeamStatus.PENDING,
    })
    status!: TeamStatus;

    @ManyToOne(() => Tournament, (tournament) => tournament.teams, { onDelete: "CASCADE" })
    tournament!: Tournament;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
