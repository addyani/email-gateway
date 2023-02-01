const db = require('../models');
const Contact = db.contact;

class ContactController {
    static async getAll(req, res, next) {
        await Contact.findAll()
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

    static async getAllIncludeCC(req, res, next) {
        await Contact.findAll({ where: {type: 'cc' }})
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

    static async getAllIncludeTo(req, res, next) {
        await Contact.findAll({ where: {type: 'recipient' }})
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
        await Contact.findByPk(id)
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
        var payload = {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            type: req.body.type,
            company_id: req.body.company_id
        }
        await Contact.create(payload)
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
        const id = req.params.id;
        var payload = {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            type: req.body.type,
            company_id: req.body.company_id
        }
        await Contact.update(payload, {
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
        await Contact.destroy({
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

module.exports = ContactController