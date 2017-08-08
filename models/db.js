const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/gifbin');


const snippetSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
})

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, lowercase: true, required: true },
    passwordHash: { type: String, required: true }
});

userSchema.virtual('password')
    .get(function () { return null })
    .set(function (value) {
        const hash = bcrypt.hashSync(value, 8);
        this.passwordHash = hash;
    })

userSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
}
userSchema.statics.authenticate = function (username, password, done) {
    this.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            done(err, false)
        } else if (user && user.authenticate(password)) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
};

function registerUser(username, password) {
    let user = new User({ username: username, password: password })
    user.save()
        .then(function (result) {
            console.log(result)
        })
        .catch(function (error) {
            console.log("There was an error", error)
        })
}

const Snippet = mongoose.model('snippets', snippetSchema);
const User = mongoose.model('User', userSchema);

// let jase = new User({ username: "jase", password: "badpassword" })

// jase.save()
//     .then(function (result) {
//         console.log(result)
//     })
//     .catch(function (error) {
//         console.log("There was an error", error)
//     })

//User.authenticate("jase","badpasswrd",console.log)


module.exports = {
    Snippet: Snippet,
    User: User
};