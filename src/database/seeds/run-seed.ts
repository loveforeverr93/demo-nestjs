import { DataSource } from 'typeorm';
import { seedAdmin } from './user-admin';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module';

export async function runSeeds(dataSource: DataSource) {
  await seedAdmin(dataSource);
}

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  console.log('🌱 Running seeds');
  try {
    const dataSource = await new DataSource({
      type: configService.get<string>('database.type') as 'mysql',
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      username: configService.get<string>('database.username'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.name'),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    }).initialize();
    await runSeeds(dataSource);
    await dataSource.destroy();
  } catch (e) {
    console.error(e);
  }
}
run();
