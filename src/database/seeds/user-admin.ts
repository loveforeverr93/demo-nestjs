import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../../common/constants/role.enum';
import { User } from '../../modules/users/entities/user.entity';

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminUsername = 'admin';
  const adminEmail = 'admin@example.com';

  const exists = await userRepository.findOne({
    where: [
      { username: adminUsername },
      { email: adminEmail },
      { role: RoleEnum.ADMIN },
    ],
  });

  if (exists) {
    console.log('✅ Admin user already exists');
    return;
  }

  const rawPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123456';

  const admin = userRepository.create({
    username: adminUsername,
    userCode: 'ADMIN-001',
    password: await bcrypt.hash(rawPassword, 10),
    fullName: 'Admin',
    email: adminEmail,
    role: RoleEnum.ADMIN,
    createdAt: new Date(),
  });
  await userRepository.save(admin);

  console.log('✅ Admin user created');
}
