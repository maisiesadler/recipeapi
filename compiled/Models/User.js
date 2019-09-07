"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BaseModel_1 = require("./BaseModel");
var passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    password: String,
    name: String,
    recipes: [mongoose_1.Schema.Types.ObjectId]
});
class User extends BaseModel_1.BaseModel {
    static register(user, password, fn) { }
    static authenticate() { }
    static serializeUser() { }
    static deserializeUser() { }
}
exports.User = User;
userSchema.plugin(passportLocalMongoose);
// userSchema.add({ users: [Schema.Types.ObjectId] })
exports.User = mongoose_1.model("r_User", userSchema);
//# sourceMappingURL=User.js.map