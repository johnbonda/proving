var api = require('../utils/api');
var mail = require("../utils/sendmail");
var getAddressURL = "webpage address";
var util = require("../utils/util.js");

module.exports = {

    registerEmployee: async function(email, empID, countryCode, salary){
        
        var registered = await app.model.Employee.findOne({
            condition: {
                email: email
            }
        });

        if(registered.walletAddress === 'NA'){
            mail.sendMail(email, "Please share your wallet address with us", getAddressURL+registered.token);
            return "Email already registered but no wallet Address";
        }

        if(registered) return "Email already registered";

        if(api.emailExistsInBelrium(email)){
            
            let token = util.getRandomKey();
            app.sdb.create('employee', {
                email: email,
                empID: empID,
                walletAddress: 'NA',
                salary: salary,
                countryCode: countryCode
            });

            app.sdb.create('otp',{
                otp: token,
                email: email
            });
            mail.sendMail(email, "Please share your wallet address with us", getAddressURL+registered.token);

        }else{
            var result = api.createWallet(email,countryCode);

            app.sdb.create('employee', {
                email: email,
                empID: empID,
                walletAddress: result.walletAddress,
                salary: salary,
                countryCode: countryCoded
            });
            console.log("Created wallet");
        }     
        console.log("Employee Registered");
    },

    putWalletAddress: async function(otpnumber){
        var result = app.model.otp.findOne({
            condition: {
                otp: otpnumber
            }
        });

        if(!result) return "Inv"
    }
}