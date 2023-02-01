const db = require('../models');
const Company = db.company;
const Contact = db.contact;

class CompanyController {
    static async getAll(req, res, next) {
        const data = await Company.findAll();
        if (data) {
            res.status(200).json({
                info: "find all success",
                data: data
            });
        } else {
            res.status(400).json({
                info: "Company not found"
            });
        };
    };

    static async getAllInclude(req, res, next) {
        const data = await Company.findAll({ include: Contact});
        if (data) {
            res.status(200).json({
                info: "find all success",
                data: data
            });
        } else {
            res.status(400).json({
                info: "Company not found"
            });
        };
    };

    static async getById(req, res, next) {
        var id = parseInt(req.params.id);
        const data = await Company.findByPk(id);
        if (data) {
            res.status(200).json({
                info: "find with id success",
                data: data
            });
        } else {
            res.status(400).json({
                info: "Company not found"
            });
        };
    };

    static async getByIdInclude(req, res, next) {
        var id = parseInt(req.params.id);
        const data = await Company.findOne({
            where: { id: id },
            include: [{
                model: Contact,
                as: 'contacts'
              }]
        });
        if (data) {
            res.status(200).json({
                info: "find with id success",
                data: data
            });
        } else {
            res.status(400).json({
                info: "Company not found"
            });
        };
    };

    static async postCreate(req, res, next) {
        var payload = {
            name: req.body.name,
            address: req.body.address
        };
        await Company.create(payload)
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
            address: req.body.address
        };
        await Company.update(payload, {
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
        await Company.destroy({
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

module.exports = CompanyController