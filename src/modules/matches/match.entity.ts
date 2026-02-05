import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Tournament } from "../tournaments/tournament.entity";
import { Team } from "../teams/team.entity";

export enum MatchStatus {
    SCHEDULED = "scheduled",
    LIVE = "live",
    COMPLETED = "completed",
}

@Entity()
export class Match {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Tournament, (tournament) => tournament.matches, { onDelete: "CASCADE" })
    tournament!: Tournament;

    @ManyToOne(() => Team, { nullable: true })
    homeTeam?: Team;

    @ManyToOne(() => Team, { nullable: true })
    awayTeam?: Team;

    @Column({ type: "int", default: 0 })
    homeScore!: number;

    @Column({ type: "int", default: 0 })
    awayScore!: number;

    @Column()
    startTime!: Date;

    @Column({
        type: "enum",
        enum: MatchStatus,
        default: MatchStatus.SCHEDULED,
    })
    status!: MatchStatus;

    @Column({ nullable: true })
    round?: number;

    @Column({ nullable: true })
    bracketPosition?: number; // E.g., match number in the bracket

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
