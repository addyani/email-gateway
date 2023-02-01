const fs = require('fs');
const request = require('request-promise');
const AuthHelper = require('../helpers/authHelper');
const CryptoHelper = require('../helpers/cryptoHelper');
const db = require('../models');
const Mailbox = db.mailbox;
const MailboxScedule = db.mailbox_schedule;
const Contact = db.contact;
const Company = db.company;
const TemplateMail = db.template_mail;

class SendMailController {
    static async postSendMail(req, res, next) {
        try {
            const ccSplit = req.body.cc.replace('"','').split(",");
            const ccRecipients = ccSplit.map((cc) => {
                return {
                    "emailAddress": {
                        "address": cc
                    }
                };
            });

            //For get value attachments
            const attachments = req.files.map((file) => {
                const filepath = `./public/files/${file.filename}`;
                const content = fs.readFileSync(filepath);
                const contentUrl = new Buffer(content).toString("base64");
                return {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    contentBytes: contentUrl,
                    name: file.originalname
                };
            });

            const userName = await AuthHelper.getUserDetail(req.session.access_token);
            //Respone For Send Message
            let countSucceeded = 0; let countFailed = 0; let scheduleCount = 0;
            let successSendTo = []; let failureSendTo = []; let scheduleSendTo = [];

            const toSplit = req.body.to.replace('"','').split(",");
            const sendMessage = toSplit.map(async (element) => {
                const contactDetail = await Contact.findOne({ where: { email: element } });
                const companyDetail = await Company.findOne({ where: { id: contactDetail.company_id } });
                //const templateMail = await TemplateMail.findOne({ where: { id: req.body.template } });

                let gender = "Mr/Mrs";
                if (contactDetail.gender == "male") {
                    gender = "Mr";
                } else if (contactDetail.gender == "female") {
                    gender = "Mrs";
                };

                let bodyMessage = ``
                let subjectMessage = ``
                if(req.body.template) {
                    bodyMessage = `
                    <p>Halo ${gender}, ${contactDetail.name} from ${companyDetail.name} 👋🏻</p>

                    <p>${templateMail.body}</p>

                    <p>Best regards,🤝</p>
                    <p>${userName.displayName}</p>
                    <p>${userName.jobTitle}</p>
                    `;

                    subjectMessage = templateMail.subject;
                } else {
                    bodyMessage = `
                    <p>Halo ${gender}, ${contactDetail.name} from ${companyDetail.name} 👋🏻</p>

                    <p>This is header ✍🏻</p>
                    <p>${req.body.body}</p>
                    <p>This is footer</p>

                    <p>Best regards,🤝</p>
                    <p>${userName.displayName}</p>
                    <p>${userName.jobTitle}</p>
                    `;

                    subjectMessage = req.body.subject;
                };

                //Create message
                const message = {
                    subject: subjectMessage,
                    body: {
                        contentType: "HTML",
                        content: bodyMessage
                    },
                    toRecipients: [{
                        emailAddress: {
                            address: element,
                        }
                    }],
                    ccRecipients: ccRecipients,
                    attachments: attachments
                };

                //if sending email using schedule
                let messageNew = {};
                if (req.body.schedule) {
                    message.singleValueExtendedProperties = [
                        {
                            id: "SystemTime 0x3FEF",
                            value: req.body.schedule
                        }
                    ]
                    messageNew.saveToSentItems = "true"
                } else {
                    messageNew.saveToSentItems = "false"
                };
                messageNew.message = message;

                //Setting option for request-promise post
                const options = {
                    method: 'POST',
                    uri: `https://graph.microsoft.com/v1.0/me/sendMail`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${req.session.access_token}`
                    },
                    body: messageNew,
                    json: true
                };

                if (!req.body.schedule) {
                    //Post to graph api endpoint for send email
                    try {
                        await request(options);
                        if (res.statusCode === 200) {
                            countSucceeded++;
                            successSendTo.push(element);
                        } else {
                            countFailed++;
                            failureSendTo.push(element);
                        };
                    } catch (e) {
                        countFailed++;
                        failureSendTo.push(element);
                    }

                } else {
                    scheduleCount++;
                    scheduleSendTo.push(element);
                };

                //If every toRecieve email sending return value for respone
                if ((countSucceeded + countFailed + scheduleCount) === toSplit.length) {
                    const toRecipientsDbMap = toSplit.map((element) => { return element; });
                    const toRecipientsDb = toRecipientsDbMap.join(" ");

                    const ccRecipientsDbMap = ccSplit.map((cc) => { return cc });
                    const ccRecipientsDb = ccRecipientsDbMap.join(" ");

                    const attachmentsMap = req.files.map((file) => { return file.filename });
                    const attachmentsDb = attachmentsMap.join("=");

                    const bodyDb = req.body.body;
                    const subjectDb = req.body.subject;
                    const scheduleDb = req.body.schedule;

                    let payload = {
                        username: userName.mail,
                        subject: subjectDb,
                        body: bodyDb,
                        to: toRecipientsDb,
                        cc: ccRecipientsDb,
                        attachment: attachmentsDb
                    };
                    if (req.body.schedule) {
                        payload.schedule = scheduleDb;

                        const access_token = req.session.access_token;
                        const refresh_token = req.session.refresh_token;
                        const encodeAccessToken = CryptoHelper.encode(access_token);
                        const encodeRefreshToken = CryptoHelper.encode(refresh_token);

                        payload.access_token = encodeAccessToken;
                        payload.refresh_token = encodeRefreshToken;
                        await MailboxScedule.create(payload);
                    } else {
                        payload.schedule = new Date().toDateString();
                        await Mailbox.create(payload);
                    }

                    let respon = {
                        count: {
                            success: countSucceeded,
                            failure: countFailed,
                            schedule: scheduleCount
                        },
                        email: {
                            success: successSendTo,
                            failure: failureSendTo,
                            schedule: scheduleSendTo
                        }
                    }
                    res.status(200).json({
                        message: 'Email sent successfully.',
                        respon: respon
                    });
                }
            });


        } catch (err) {
            res.status(500).json({
                message: 'An error occurred while sending the email.'
            });
        };
    };
};

module.exports = SendMailController