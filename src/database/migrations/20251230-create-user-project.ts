import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProject20251230 implements MigrationInterface {
  name = 'CreateUserProject20251230';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users(
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(20) NOT NULL,
        role ENUM('ADMIN', 'USER') DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      )
      `);

    await queryRunner.query(`
      CREATE TABLE projects(
        project_id INT AUTO_INCREMENT PRIMARY KEY,
        project_name VARCHAR(20) NOT NULL,
        owner_id INT NOT NULL,
        status ENUM('PLANNING', 'IN_PROGRESS', 'PENDING', 'COMPLETED') DEFAULT 'PLANNING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES users(user_id)
      )
      `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE projects`);
    await queryRunner.query(`DROP TABLE users`);
  }
}
