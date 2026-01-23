import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProjectMemberColumns1769000000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'projects_members_users',
      'projectId',
      'project_id',
    );

    await queryRunner.renameColumn(
      'projects_members_users',
      'userId',
      'user_id',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'projects_members_users',
      'project_id',
      'projectId',
    );

    await queryRunner.renameColumn(
      'projects_members_users',
      'user_id',
      'userId',
    );
  }
}
