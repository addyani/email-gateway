var express = require('express');
var router = express.Router();
const fs = require('fs');
const request = require('request-promise');

const db = require('../models');
const Mailbox = db.mailbox;
const MailboxScedule = db.mailbox_schedule;
const Contact = db.contact;
const Company = db.company;

const AuthHelper = require('../helpers/authHelper');
const CryptoHelper = require('../helpers/cryptoHelper');

async function schedulerOneHours() {
    const data = await MailboxScedule.findAll();

    await data.forEach(async element => {
        try {
            const refreshToken = CryptoHelper.decode(element.refresh_token);

            const token = await AuthHelper.refreshToken(refreshToken);
            const accessTokenRequest = token.access_token;
            const refreshTokenRequest = token.refresh_token;

            const accessTokenNew = CryptoHelper.encode(accessTokenRequest);
            const refreshTokenNew = CryptoHelper.encode(refreshTokenRequest);
            
            let payload = {
                access_token: accessTokenNew,
                refresh_token: refreshTokenNew
            };
            await MailboxScedule.update(payload, { where: { id: element.id } })
        } catch (err) {

        }
    });
};

//Every one Hours Update Access Token
//schedulerOneHours();
const oneHours = setInterval(schedulerOneHours, 60 * 60 * 1000);

async function schedulerOneMinute() {
    const data = await MailboxScedule.findAll();

    await data.forEach(async element => {
        const currentDate = new Date();
        const endDate = new Date(element.schedule);
        const timeRemaining = Math.round((endDate - currentDate) / 1000);

        if (timeRemaining >= 0) {
            // for performance efficient
        } else {
            const arrayTo = element.to.split(' ');
            const arrayCC = element.cc.split(' ');
            const arrayAttacment = element.attachment.split('=');

            const ccRecipients = arrayCC.map((cc) => {
                return {
                    "emailAddress": {
                        "address": cc
                    }
                };
            });

            const attachments = arrayAttacment.map((file) => {
                const filepath = `./public/files/${file}`;
                const content = fs.readFileSync(filepath);
                const contentUrl = new Buffer(content).toString("base64");
                const name = file.split("-")[1];
                return {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    contentBytes: contentUrl,
                    name: name
                };
            });

            const accessToken = CryptoHelper.decode(element.access_token);
            const userName = await AuthHelper.getUserDetail(accessToken);
            
            console.log(userName.displayName);
            let countSucceeded = 0; 
            const sendMessage = arrayTo.map(async (elementEmail) => {
                const contactDetail = await Contact.findOne({ where: { email: elementEmail } });
                const companyDetail = await Company.findOne({ where: { id: contactDetail.company_id } });

                let gender = "Mr/Mrs";
                if (contactDetail.gender == "male") {
                    gender = "Mr";
                } else if (contactDetail.gender == "female") {
                    gender = "Mrs";
                };

                let bodyMessage = `
                    <p>Halo ${gender} ${contactDetail.name} from ${companyDetail.name} 👋🏻</p>
                    
                    <p>This is header ✍🏻</p>
                    <p>${element.body}</p>
                    <p>This is footer</p>

                    <p>Best regards,🤝</p>
                    <p>${userName.displayName}</p>
                    <p>${userName.jobTitle}</p>
                `;

                const message = {
                    subject: element.subject,
                    body: {
                        contentType: "HTML",
                        content: bodyMessage
                    },
                    toRecipients: [{
                        emailAddress: {
                            address: elementEmail,
                        }
                    }],
                    ccRecipients: ccRecipients,
                    attachments: attachments
                };

                let messageNew = {};
                messageNew.saveToSentItems = "false"
                messageNew.message = message;
    
                const options = {
                    method: 'POST',
                    uri: `https://graph.microsoft.com/v1.0/me/sendMail`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: messageNew,
                    json: true
                };
    
                await request(options);
                countSucceeded++;

                if ((countSucceeded) === arrayTo.length) {
                    let payload = {
                        username: element.username,
                        subject: element.subject,
                        body: element.body,
                        to: element.to,
                        cc: element.cc,
                        attachment: element.attachment,
                        schedule: element.schedule
                    };
                    Mailbox.create(payload);
                    MailboxScedule.destroy({
                        where: { id: element.id }
                    });
                };
            });
        }

    });
};

//Every 30 Second Check Database On Schedule mail for updates sending
//schedulerOneMinute();
const oneMinute = setInterval(schedulerOneMinute, 60 * 1000);

//Example count 60 * 1000 = 1 minute
//Example count 60 * 60 * 1000 = 1 hour
//Example count 24 * 60 * 60 * 1000 = 1 day

module.exports = router;
