var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var trajetSchema = mongoose.Schema({

    position                : {
        lon                 : String,
        lat                 : String
    },
    busy                    : Boolean,
    chauffeur               : Date
});

// methods ======================
// generating a hash
travauxSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
travauxSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Trajet', travauxSchema);
