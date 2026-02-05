import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770313147469 implements MigrationInterface {
    name = 'InitialSchema1770313147469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // User Table
        await queryRunner.query(`CREATE TABLE \`user\` (
            \`id\` varchar(36) NOT NULL,
            \`email\` varchar(255) NOT NULL,
            \`password\` varchar(255) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`role\` enum ('admin', 'organizer', 'user') NOT NULL DEFAULT 'user',
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            UNIQUE INDEX \`IDX_user_email\` (\`email\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);

        // Tournament Table
        await queryRunner.query(`CREATE TABLE \`tournament\` (
            \`id\` varchar(36) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`description\` text NULL,
            \`startDate\` datetime NOT NULL,
            \`endDate\` datetime NOT NULL,
            \`status\` enum ('draft', 'registration_open', 'in_progress', 'completed') NOT NULL DEFAULT 'draft',
            \`maxTeams\` int NOT NULL DEFAULT '16',
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);

        // Team Table
        await queryRunner.query(`CREATE TABLE \`team\` (
            \`id\` varchar(36) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`logoUrl\` varchar(255) NULL,
            \`captainName\` varchar(255) NULL,
            \`contactEmail\` varchar(255) NULL,
            \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            \`tournamentId\` varchar(36) NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);

        // Match Table
        await queryRunner.query(`CREATE TABLE \`match\` (
            \`id\` varchar(36) NOT NULL,
            \`homeScore\` int NOT NULL DEFAULT '0',
            \`awayScore\` int NOT NULL DEFAULT '0',
            \`startTime\` datetime NOT NULL,
            \`status\` enum ('scheduled', 'live', 'completed') NOT NULL DEFAULT 'scheduled',
            \`round\` int NULL,
            \`bracketPosition\` int NULL,
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            \`tournamentId\` varchar(36) NULL,
            \`homeTeamId\` varchar(36) NULL,
            \`awayTeamId\` varchar(36) NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);

        // Bracket Table
        await queryRunner.query(`CREATE TABLE \`bracket\` (
            \`id\` varchar(36) NOT NULL,
            \`structureData\` json NULL,
            \`type\` varchar(255) NOT NULL DEFAULT 'single_elimination',
            \`tournamentId\` varchar(36) NULL,
            UNIQUE INDEX \`REL_bracket_tournament\` (\`tournamentId\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);

        // Foreign Keys
        await queryRunner.query(`ALTER TABLE \`team\` ADD CONSTRAINT \`FK_team_tournament\` FOREIGN KEY (\`tournamentId\`) REFERENCES \`tournament\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`match\` ADD CONSTRAINT \`FK_match_tournament\` FOREIGN KEY (\`tournamentId\`) REFERENCES \`tournament\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`match\` ADD CONSTRAINT \`FK_match_homeTeam\` FOREIGN KEY (\`homeTeamId\`) REFERENCES \`team\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`match\` ADD CONSTRAINT \`FK_match_awayTeam\` FOREIGN KEY (\`awayTeamId\`) REFERENCES \`team\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bracket\` ADD CONSTRAINT \`FK_bracket_tournament\` FOREIGN KEY (\`tournamentId\`) REFERENCES \`tournament\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bracket\` DROP FOREIGN KEY \`FK_bracket_tournament\``);
        await queryRunner.query(`ALTER TABLE \`match\` DROP FOREIGN KEY \`FK_match_awayTeam\``);
        await queryRunner.query(`ALTER TABLE \`match\` DROP FOREIGN KEY \`FK_match_homeTeam\``);
        await queryRunner.query(`ALTER TABLE \`match\` DROP FOREIGN KEY \`FK_match_tournament\``);
        await queryRunner.query(`ALTER TABLE \`team\` DROP FOREIGN KEY \`FK_team_tournament\``);

        await queryRunner.query(`DROP INDEX \`REL_bracket_tournament\` ON \`bracket\``);
        await queryRunner.query(`DROP TABLE \`bracket\``);
        await queryRunner.query(`DROP TABLE \`match\``);
        await queryRunner.query(`DROP TABLE \`team\``);
        await queryRunner.query(`DROP TABLE \`tournament\``);
        await queryRunner.query(`DROP INDEX \`IDX_user_email\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }
}
