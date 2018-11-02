var crypto = require("crypto");
var sodium = require('sodium').api;
var ByteBuffer = require("bytebuffer");

module.exports = {
    
    MakeKeypair: function (hash) {
        var keypair = sodium.crypto_sign_seed_keypair(hash);
        return {
          publicKey: keypair.publicKey,
          privateKey: keypair.secretKey
        };
    },
    
    Sign: function (hash, keypair) {
        return sodium.crypto_sign_detached(hash, Buffer.from(keypair.privateKey, 'hex'));
    },
    
    Verify: function (hash, signature, publicKey) {
        var signatureBuffer = new Buffer(signature);
        var publicKeyBuffer = new Buffer(publicKey);
        return sodium.crypto_sign_verify_detached(signatureBuffer, hash, publicKeyBuffer);
    },

    getHash: function(data){
        buffer = new ByteBuffer(1000, true);
            for(x in data){
                buffer.writeString(x);
            }
    
            return  crypto.createHash('sha256').update(buffer.toBuffer()).digest();
    },
    
    getSignature: function(data, secret){
        var datahash = this.getHash(data);
        return this.getSignatureByHash(datahash, secret);
    },

    getSignatureByHash: function(datahash, secret){
        var secrethash = crypto.createHash('sha256').update(secret, 'utf8').digest();
        var Keypair = this.MakeKeypair(secrethash);
        comsign = this.Sign(datahash,Keypair);
        //console.log("companysign :"+comsign);
        return comsign;
    },

    getPublicKey: function(secret){
        var secrethash = crypto.createHash('sha256').update(secret, 'utf8').digest();
        var Keypair = this.MakeKeypair(secrethash);
        return Keypair.publicKey.toString('hex');
    }
}