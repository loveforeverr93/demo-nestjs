import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProject20251230 implements MigrationInterface {
  name = 'CreateUserProject20251230';

  async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tạo bảng users
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`user_id\` int NOT NULL AUTO_INCREMENT,
                \`user_code\` varchar(255) NULL,
                \`username\` varchar(20) NOT NULL,
                \`password\` varchar(100) NOT NULL,
                \`full_name\` varchar(100) NOT NULL,
                \`email\` varchar(100) NOT NULL,
                \`user_role\` enum('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_user_code\` (\`user_code\`),
                UNIQUE INDEX \`IDX_username\` (\`username\`),
                UNIQUE INDEX \`IDX_email\` (\`email\`),
                PRIMARY KEY (\`user_id\`)
            ) ENGINE=InnoDB
        `);

    // 2. Tạo bảng projects
    await queryRunner.query(`
            CREATE TABLE \`projects\` (
                \`project_id\` int NOT NULL AUTO_INCREMENT,
                \`project_code\` varchar(255) NOT NULL,
                \`project_name\` varchar(100) NOT NULL,
                \`project_status\` enum('PLANNING', 'IN_PROGRESS', 'PENDING', 'COMPLETED') NOT NULL DEFAULT 'PLANNING',
                \`project_priority\` enum('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'LOW',
                \`project_description\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`ownerUserId\` int NULL,
                UNIQUE INDEX \`IDX_project_code\` (\`project_code\`),
                PRIMARY KEY (\`project_id\`),
                CONSTRAINT \`FK_project_owner\` FOREIGN KEY (\`ownerUserId\`) REFERENCES \`users\` (\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);

    // 3. Tạo bảng trung gian cho ManyToMany (members)
    await queryRunner.query(`
            CREATE TABLE \`projects_members_users\` (
                \`projectId\` int NOT NULL,
                \`userId\` int NOT NULL,
                INDEX \`IDX_project\` (\`projectId\`),
                INDEX \`IDX_user\` (\`userId\`),
                PRIMARY KEY (\`projectId\`, \`userId\`),
                CONSTRAINT \`FK_pm_project\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\` (\`project_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT \`FK_pm_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa theo thứ tự ngược lại để tránh lỗi Foreign Key
    await queryRunner.query(`DROP TABLE \`projects_members_users\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
