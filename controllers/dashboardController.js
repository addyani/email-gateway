const request = require('request-promise');
const AuthHelper = require('../helpers/authHelper');

class DashboardController {
    static async getIndex(req, res, next) {
        res.render('index', { title: 'Form Login' });
    };

    static async getLogin(req, res, next) {
        res.redirect('/authorize/login');
    };

    static async getMailbox(req, res, next) {
        res.render('index', { title: 'Form Mailbox' });
    };

    static async postMailbox(req, res, next) {
        const option = {
            method: 'POST',
            uri: 'http://localhost:3000/send-email',
            json: true
        };

        await request(option);
        res.redirect('/dashboard');
    };

    static async getDashboard(req, res, next) {
        const dataMailbox = {
            uri: 'http://localhost:3000/mailbox',
            json: true
        };

        const dataMailboxSchedule = {
            uri: 'http://localhost:3000/mailbox-scheduler',
            json: true
        };

        const user = await AuthHelper.getUserDetail(req.session.access_token);
        const mailbox = await request(dataMailbox);
        const mailboxSchedule = await request(dataMailboxSchedule);

        res.status(200).render('index', {
            title: 'Dashbord',
            user: user,
            mailbox: mailbox,
            mailboxSchedule: mailboxSchedule
        });
    };

    static async getCompanyContact(req, res, next) {
        const data = {
            uri: 'http://localhost:3000/company/include/contact',
            json: true
        };

        const datas = await request(data);

        res.status(200).render('index', {
            title: 'Form Company Contact',
            data: datas
        });

    };

    //CRUD Company
    static async getCompanyAll(req, res, next) {
        const urlMail = `http://localhost:3000/company`;
        const data = {
            uri: urlMail,
            json: true
        };

        res.render('index', {
            title: 'Form Create Template'
        });
    };

    static async getCompanyDetail(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/company/${id}`;
        const data = {
            uri: urlMail,
            json: true
        };

        const datas = await request(data);

        res.render('index', {
            title: 'Form Template Detail',
            data: datas
        });
    };

    static async postCompanyCreate(req, res, next) {
        const urlMail = `http://localhost:3000/company`;
        const option = {
            method: 'POST',
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/company-contact');
    };

    static async postCompanyUpdate(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/company/update/${id}`;
        const option = {
            method: 'POST',
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/company-contact');
    };

    static async getCompanyDelete(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/company/delete/${id}`;
        const option = {
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/company-contact');
    };

    //CRUD Contact
    static async getContactAll(req, res, next) {
        const urlMail = `http://localhost:3000/contact`;
        const data = {
            uri: urlMail,
            json: true
        };

        res.render('index', {
            title: 'Form Create Template'
        });
    };

    static async getContactDetail(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/contact/${id}`;
        const data = {
            uri: urlMail,
            json: true
        };

        const datas = await request(data);

        res.render('index', {
            title: 'Form Template Detail',
            data: datas
        });
    };

    static async postContactCreate(req, res, next) {
        const urlMail = `http://localhost:3000/contact`;
        const option = {
            method: 'POST',
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/company-contact');
    };

    static async postContactUpdate(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/contact/update/${id}`;
        const option = {
            method: 'POST',
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/company-contact');
    };

    static async getContactDelete(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/contact/delete/${id}`;
        const option = {
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/company-contact');
    };

    //Read, Update, Delete MAILBOX SCHEDULE
    static async getMailboxScheduleDetail(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/mailbox-scheduler/${id}`;
        const data = {
            uri: urlMail,
            json: true
        };

        const datas = await request(data);

        res.status(200).render('index', {
            title: 'Form Detail Mailbox Scheduler For Update Or Delete',
            data: datas
        });
    };

    static async postMailboxScheduleUpdate(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/mailbox-scheduler/update/${id}`;
        const option = {
            method: 'POST',
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/dashboard');
    };

    static async getMailboxScheduleDelete(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/mailbox-scheduler/delete/${id}`;
        const option = {
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/dashboard');
    };

    //CRUD MAILBOX Template
    static async getTemplateMailboxAll(req, res, next) {
        const urlMail = `http://localhost:3000/mailbox-template`;
        const data = {
            uri: urlMail,
            json: true
        };

        res.render('index', {
            title: 'Form Create Template'
        });
    };

    static async getTemplateMailboxDetail(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/mailbox-template/${id}`;
        const data = {
            uri: urlMail,
            json: true
        };

        const datas = await request(data);

        res.render('index', {
            title: 'Form Template Detail',
            data: datas
        });
    };

    static async postTemplateMailboxCreate(req, res, next) {
        const urlMail = `http://localhost:3000/mailbox-template`;
        const option = {
            method: 'POST',
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/dashboard');
    };

    static async postTemplateMailboxUpdate(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/mailbox-template/update/${id}`;
        const option = {
            method: 'POST',
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/dashboard');
    };

    static async getTemplateMailboxDelete(req, res, next) {
        const id = req.params.id;
        const urlMail = `http://localhost:3000/mailbox-template/delete/${id}`;
        const option = {
            uri: urlMail,
            body: req.body,
            json: true
        };

        await request(option);
        res.redirect('/dashboard');
    };
};

module.exports = DashboardController