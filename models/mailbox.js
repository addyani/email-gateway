module.exports = (sequelize, Sequelize) => {
  const Mailbox = sequelize.define("mailbox", {
    username: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING,
    },
    body: {
      type: Sequelize.STRING,
    },
    to: {
      type: Sequelize.STRING,
    },
    cc: {
      type: Sequelize.STRING,
    },
    attachment: {
      type: Sequelize.STRING,
    },
    schedule: {
      type: Sequelize.STRING,
    },
  });

  return Mailbox;
};