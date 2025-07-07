export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('clients', [
      {
        srNo: 1,
        sfId: 'SF001',
        name: 'Acme Corp',
        email: 'contact@acme.com',
        departmentType: 'Aggregator OB',
        checklistStatus: 'Completed (100%)',
        assigningUserId: 2, // John Doe
        status: 'Active',
        logo: 'uploads/acme-logo.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        srNo: 2,
        sfId: 'SF002',
        name: 'Beta Inc',
        email: 'info@beta.com',
        departmentType: 'SMBs',
        checklistStatus: 'Pending (60%)',
        assigningUserId: 3, // Jane Smith
        status: 'Inactive',
        logo: 'uploads/beta-logo.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        srNo: 3,
        sfId: 'SF003',
        name: 'Gamma Solutions',
        email: 'support@gamma.com',
        departmentType: 'White Label',
        checklistStatus: 'Pending (10%)',
        assigningUserId: 2,
        status: 'Active',
        logo: 'uploads/gamma-logo.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('clients', null, {});
  }
};
