module.exports = (sequelize, Sequelize) => {
    const MailboxSchedule = sequelize.define("mailbox_schedule", {
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
      access_token: {
        type: Sequelize.TEXT,
      },
      refresh_token: {
        type: Sequelize.TEXT,
      },
    });
  
    return MailboxSchedule;
  };