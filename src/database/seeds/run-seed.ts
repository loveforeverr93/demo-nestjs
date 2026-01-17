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
    try {
      console.log('🌱 Running seeds');
      // ... logic seed của bạn ...
      console.log('✅ Admin user already exists');
    } catch (error) {
      console.error('❌ Seed error:', error);
      process.exit(1); // Thoát với lỗi
    } finally {
      await dataSource.destroy(); // QUAN TRỌNG: Đóng kết nối DB
      console.log('👋 Seed finished, exiting...');
      process.exit(0); // QUAN TRỌNG: Thoát tiến trình để lệnh tiếp theo chạy
    }
  } catch (e) {
    console.error(e);
  }
}
run();
