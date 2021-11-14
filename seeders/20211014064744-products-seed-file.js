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
        image: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/1920/1080`,
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
