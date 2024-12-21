import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventRequestTable1734637419166 implements MigrationInterface {
    name = 'CreateEventRequestTable1734637419166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."event_request_status_enum" AS ENUM('Pending', 'Accepted', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "event_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."event_request_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, "userId" uuid, CONSTRAINT "PK_f53c623543f147f0e21e58ea13e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_request" ADD CONSTRAINT "FK_e1c5e3524e9e797c55b0200b8c8" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_request" ADD CONSTRAINT "FK_43858c17b10229b70240d1bde71" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_request" DROP CONSTRAINT "FK_43858c17b10229b70240d1bde71"`);
        await queryRunner.query(`ALTER TABLE "event_request" DROP CONSTRAINT "FK_e1c5e3524e9e797c55b0200b8c8"`);
        await queryRunner.query(`DROP TABLE "event_request"`);
        await queryRunner.query(`DROP TYPE "public"."event_request_status_enum"`);
    }

}
