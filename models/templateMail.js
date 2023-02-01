module.exports = (sequelize, Sequelize) => {
    const TemplateMail = sequelize.define("template_mail", {
      username: {
        type: Sequelize.STRING,
      },
      subject: {
        type: Sequelize.STRING,
      },
      body: {
        type: Sequelize.STRING,
      },
    });
  
    return TemplateMail;
  };