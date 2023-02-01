const db = require('../models');
const TemplateMail = db.template_mail;
const AuthHelper = require('../helpers/authHelper');

class TemplateMailController {
    static async getAll(req, res, next) {
        await TemplateMail.findAll()
            .then(data => {
                if (data) {
                    res.status(200).json({
                        info: "find all success",
                        data: data
                    });
                } else {
                    res.status(400).json({
                        info: "data not found",
                        data: data
                    });
                }
            })
            .catch(err => {
                res.status(400).json({
                    info: err
                });
            });
    };

    static async getAllUsers(req, res, next) {
        const user = await AuthHelper.getUserDetail(req.session.access_token);
        await TemplateMail.findAll({ where: {username: user.mail} })
            .then(data => {
                if (data) {
                    res.status(200).json({
                        info: "find all success",
                        data: data
                    });
                } else {
                    res.status(400).json({
                        info: "data not found",
                        data: data
                    });
                }
            })
            .catch(err => {
                res.status(400).json({
                    info: err
                });
            });
    };

    static async getById(req, res, next) {
        var id = parseInt(req.params.id);
        await TemplateMail.findByPk(id)
            .then(data => {
                if (data) {
                    res.status(200).json({
                        info: "find with id success",
                        data: data
                    });
                } else {
                    res.status(400).json({
                        info: "data not found",
                        data: data
                    });
                }
            })
            .catch(err => {
                res.status(400).json({
                    info: err
                });
            });
    };

    static async postCreate(req, res, next) {
        const user = await AuthHelper.getUserDetail(req.session.access_token);
        var payload = {
            username: user.mail,
            subject: req.body.subject,
            body: req.body.body
        }
        await TemplateMail.create(payload)
            .then(data => {
                res.status(200).json({
                    info: "create success",
                    data: payload
                });
            })
            .catch(err => {
                res.status(400).json({
                    info: err
                });
            });
    };

    static async postUpdate(req, res, next) {
        const user = await AuthHelper.getUserDetail(req.session.access_token);
        const id = req.params.id;
        var payload = {
            username: user.mail,
            subject: req.body.subject,
            body: req.body.body
        }
        await TemplateMail.update(payload, {
            where: { id: id }
        })
            .then(data => {
                res.status(200).json({
                    info: "update success",
                    data: payload
                });
            })
            .catch(err => {
                res.status(400).json({
                    info: err
                });
            });
    };

    static async getDelete(req, res, next) {
        const id = req.params.id;
        await TemplateMail.destroy({
            where: { id: id }
        })
            .then(data => {
                res.status(200).json({
                    info: "delete success"
                });
            })
            .catch(err => {
                res.status(400).json({
                    info: err
                });
            });
    };
};

module.exports = TemplateMailController