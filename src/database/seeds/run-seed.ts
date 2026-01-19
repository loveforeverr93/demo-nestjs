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
    console.log('✅ Seeds completed successfully');
    try {
      console.log('🌱 Running seeds');
      
      console.log('✅ Admin user already exists');
    } catch (error) {
      console.error('❌ Seed error:', error);
      process.exit(1);
    } finally {
      if (dataSource && dataSource.isInitialized) {
        await dataSource.destroy();
        console.log('🔌 Database connection closed');
      }
      console.log('👋 Process exiting...');
      process.exit(0);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
