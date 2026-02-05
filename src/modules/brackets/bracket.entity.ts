import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Tournament } from "../tournaments/tournament.entity";

@Entity()
export class Bracket {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => Tournament)
    @JoinColumn()
    tournament!: Tournament;

    @Column({ type: "json", nullable: true })
    structureData?: any; // To store visual metadata or position overrides

    @Column({ default: "single_elimination" })
    type!: string;
}
