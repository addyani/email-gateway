const readXlsxFile = require('read-excel-file/node');
const DataTypeHelper = require('../helpers/DataTypeHelper');
const db = require('../models');
const Company = db.company;
const Contact = db.contact;

class ImportExcelController {
    static async postImport(req, res, next) {
        const path = ("." + '/public/excels/' + req.file.filename);
        
        importExcelCompany(path).then((company) => {
            importExcelContact(path).then((contact) => {
                readXlsxFile(path).then((rows) => {
                    let object = DataTypeHelper.arrayToJSONObject(rows);
                    let dbCompany = DataTypeHelper.uniqueObject(object, 'company');
                    let dbContact = DataTypeHelper.uniqueObject(object, 'email');
        
                    dbCompany = dbCompany.map((element) => {
                        return {
                            company: element.company,
                            address: element.address
                        }
                    });
        
                    dbContact = dbContact.map((element) => {
                        return {
                            name: element.name,
                            gender: element.gender,
                            email: element.email,
                            type: element.type
                        }
                    });
                    res.status(200).json({
                        info: "Import successfully",
                        dbCompany:dbCompany,
                        dbContact:dbContact
                    });
                })
            })
        }).catch((err) => {
            res.status(400).json({
                info: "Import failed",
                error: err
            });
        })
    };
};

var importExcelCompany = async function (filePath) {
    return new Promise(function (resolve, reject) {
        readXlsxFile(filePath).then((rows) => {
            let rowsObject = DataTypeHelper.arrayToJSONObject(rows);

            const database = [];
            rowsObject.forEach(async (element, index) => {
                await Company.findOne({ where: { name: element.company } })
                    .then(async data => {
                        if (data) {
                            console.log("Company Sudah Terdaftar: " + data.company)
                        } else {
                            var payload = {
                                name: element.company,
                                address: element.address
                            }
                            //Insert the contact
                            await Company.create(payload)
                            database.push(payload)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        reject("Server Error")
                    });
            })
            resolve(database);
        })
    });
};

var importExcelContact = async function (filePath) {
    return new Promise(function (resolve, reject) {
        readXlsxFile(filePath).then((rows) => {
            let rowsObject = DataTypeHelper.arrayToJSONObject(rows);

            const database = [];
            rowsObject.forEach(async (element, index) => {
                await Company.findOne({ where: { name: element.company } })
                    .then(async data => {
                        //Check if email is already
                        await Contact.findOne({ where: { email: element.email } })
                            .then(async dataContact => {
                                if (dataContact) {
                                    reject("Emial has already been")
                                } else {
                                    var payload = {
                                        company_id: data.id,
                                        name: element.name,
                                        gender: element.gender,
                                        email: element.email,
                                        type: element.type
                                    }
                                    //Insert the contact
                                    await Contact.create(payload)
                                    database.push(payload)
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                reject("Contact Failed to Save")
                            });
                    })
                    .catch(err => {
                        console.log(err)
                        reject("Contact Failed to Save")
                    });
            })
            resolve(database);
        })
    });
}

module.exports = ImportExcelController