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

        console.log("Issuer hash: " + hash);
        console.log("Issuer sign: " + sign);
        console.log("Issuer publickey: " + publickey);

        var base64hash = hash.toString('base64');

        var base64sign = sign.toString('base64');

        var base64publickey = publickey.toString('base64');

        console.log("Issuer base64 hash: " + base64hash);
        console.log("Issuer base64 sign: " + base64sign);
        console.log("Issuer base64 publickey: " + base64publickey);

        app.sdb.create("issue", {
            hash: base64hash,
            sign: base64sign,
            publickey: base64publickey,
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


        var base64hash = hash.toString('base64');
        console.log("Verifier base64 hash: " + base64hash)

        var result = await app.model.Issue.findOne({hash: base64hash});

        if(!result) return "Hash not found";

        //var result2 = await app.model.Employer.findOne({publickey: result.publickey});

        console.log("Verifier base64 sign: " + result.sign);
        console.log("Verifier base64 publickey: " + result.publickey);

        var sign = new Buffer(result.sign, 'base64');
        var publickey = new Buffer(result.publickey, 'base64');

        console.log("Verifier sign: " + sign);
        console.log("Verifier publickey: " + publickey);


        if(util.Verify(hash, sign, result.publickey) /*&& result2.name === obj.employer*/) return "Wrong Employer Signature";

        return "Success";

    },

    pay: async function(address, currency, amount) {
        var result = app.balances.get(address, 'BEL');
        console.log("Balance before increasing: " + result.balance);
        app.balances.increase(address, currency, amount * 100000000);
        var result2 = app.balances.get(address, 'BEL');
        console.log("Balance after increasing: " + result.balance);
        //app.balances.increase('A9fDpCe9FGQ14VwJdc1FpycxsJ9jN3Ttwf', 'BEL', '100000')
        //app.balances.decrease('A9fDpCe9FGQ14VwJdc1FpycxsJ9jN3Ttwf', 'BEL', '100000')
        //app.balances.transfer('BEL', '100000', 'A9fDpCe9FGQ14VwJdc1FpycxsJ9jN3Ttwf', 'A4MFPoF3c9vCzZ3GGf9sNQ3rDy2q8aXuVF')
  
      }

    //registerEmployee: async function()

}