var ByteBuffer = require("bytebuffer");
var util = require("../utils/util.js");
var mail = require("../utils/sendmail");

module.exports = {

    issuePaySlip: async function(email, empid, name, employer, month, year, secret){

        app.sdb.lock('payroll.issuePaySlip@'+empid);

        console.log("***********************Entered issuePaySlip************************")

        var options = {
            condition: {
                empid: empid,
                employer: employer,
                month: month,
                year: year
            }
        }

        var result = await app.model.Payslip.findOne(options);

        if(result) return "Payslip already issued";

        console.log("***********************Passed duplicate check************************")

        var paySlip = {
            email: email,
            empid: empid,
            name: name,
            employer: employer,
            month: month,
            year: year
        }

        app.sdb.create("payslip", paySlip);

        console.log("***********************app.sdb.create completed************************")
        
        
        var hash = util.getHash(JSON.stringify(paySlip));
        //console.log("Sender: " + hash);
        var sign = util.getSignatureByHash(hash, secret);
        var publickey = util.getPublicKey(secret);

        console.log("***********************Completed crypto************************")
        // /*
        //var time = this.trs.timestamp;

        //var result = app.model.Employer.findOne({publickey: publickey});
        //var employer = result.name;\

        var text = JSON.stringify(paySlip) + " Hash from issue: " + hash;

        console.log("Sign:" + sign);
        console.log("Sign text: " + String(sign));

        app.sdb.create("issue", {
            hash: String(hash),
            sign: String(sign),
            publickey: String(publickey),
        });  

        
        //Email

        var subject = "Payslip for the month " + month + " and year " + year + " issued"; 


        console.log("Issuer: " + hash);

         mail.sendMail(email, subject, text);

         //*/
    
    },

    verify: async function(obj){
        
        //app.logger.debug(objtext);
        //var obj = JSON.parse(objtext);
        var objtext = JSON.stringify(obj);
        var hash = util.getHash(objtext);
        console.log("Verifier: " + hash);
        //var hash = util.getHash(objtext);

        //mail.sendMail("john@belfricsbt.com", "From verify", objtext + "Hash from verify: " +hash);


        var result = await app.model.Issue.findOne({hash: hash});

        if(!result) return "Hash not found";

        var result2 = await app.model.Employer.findOne({publickey: result.publickey});

        if(util.Verify(hash, result.sign, result.publickey) && result2.name === obj.employer) return "Wrong Employer Signature";

        return "Success";

    },

    //registerEmployee: async function()

}