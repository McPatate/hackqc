var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var bacsSchema = mongoose.Schema({

    position                : {
        lon                 : Float,
        lat                 : Float
    },
    name                    : { type : String, unique : true }
});

// methods ======================
// generating a hash
bacsSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
bacsSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Bacs', bacsSchema);
