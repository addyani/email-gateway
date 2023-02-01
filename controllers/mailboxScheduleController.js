const db = require('../models');
const MailboxSchedule = db.mailbox_schedule;

class MailboxScheduleController {
    static async getAll(req, res, next) {
        await MailboxSchedule.findAll()
            .then(data => {
                if (data) {
                    const object = data.map( element => {
                        const attachment = element.attachment.split('=').map(oldAttachment => {
                            return oldAttachment.split('-')[1]
                        })
                        return {
                            id: element.id,
                            username: element.username,
                            subject: element.subject,
                            body: element.body,
                            to: element.to.split(' '),
                            cc: element.cc.split(' '),
                            attachment: attachment,
                            schedule: element.schedule,
                            failed_send_to: element.failed_send_to,
                            createdAt: element.createdAt,
                            updatedAt: element.updatedAt   
                        }
                    });

                    res.status(200).json({
                        info: "find all success",
                        data: object
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
        await MailboxSchedule.findAll({ where: {username: user.mail} })
            .then(data => {
                if (data) {
                    const object = data.map( element => {
                        const attachment = element.attachment.split('=').map(oldAttachment => {
                            return oldAttachment.split('-')[1]
                        })
                        return {
                            id: element.id,
                            username: element.username,
                            subject: element.subject,
                            body: element.body,
                            to: element.to.split(' '),
                            cc: element.cc.split(' '),
                            attachment: attachment,
                            schedule: element.schedule,
                            failed_send_to: element.failed_send_to,
                            createdAt: element.createdAt,
                            updatedAt: element.updatedAt   
                        }
                    });

                    res.status(200).json({
                        info: "find all success",
                        data: object
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
        await MailboxSchedule.findByPk(id)
            .then(data => {
                if (data) {
                    const attachment = data.attachment.split('=').map(oldAttachment => {
                        return oldAttachment.split('-')[1]
                    })
                    const object = {
                        id: data.id,
                        username: data.username,
                        subject: data.subject,
                        body: data.body,
                        to: data.to.split(' '),
                        cc: data.cc.split(' '),
                        attachment: attachment,
                        schedule: data.schedule,
                        failed_send_to: data.failed_send_to,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt    
                    }

                    res.status(200).json({
                        info: "find with id success",
                        data: object
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
            body: req.body.body,
            to: req.body.to,
            cc: req.body.cc,
            attachment: req.body.attachment,
            schedule: req.body.schedule,
            access_token: req.body.access_token,
            refresh_token: req.body.refresh_token
        }
        await MailboxSchedule.create(payload)
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
            body: req.body.body,
            to: req.body.to,
            cc: req.body.cc,
            attachment: req.body.attachment,
            schedule: req.body.schedule,
            access_token: req.body.access_token,
            refresh_token: req.body.refresh_token
        }
        await MailboxSchedule.update(payload, {
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
        await MailboxSchedule.destroy({
            where: { id: id }
        })
            .then(data => {
                res.status(200).json({
                    info: "delete success",
                    data: data
                });
            })
            .catch(err => {
                res.status(400).json({
                    info: err
                });
            });
    };
};

module.exports = MailboxScheduleController