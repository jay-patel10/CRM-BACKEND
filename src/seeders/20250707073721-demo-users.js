import bcrypt from 'bcryptjs';

export default {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'Super Admin',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('john123', 10),
        role: 'User',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('jane123', 10),
        role: 'User',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
