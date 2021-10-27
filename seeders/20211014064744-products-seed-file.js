var faker = require('faker');
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products',
      Array.from({ length: 400 }).map((item, index) =>
      ({
        id: index + 1,
        name: faker.commerce.productName(),
        description: faker.commerce.product() + '/' + faker.commerce.productName(),
        price: faker.commerce.price(),
        image: `http://placeimg.com/640/${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
