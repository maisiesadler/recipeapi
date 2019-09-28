import { model, Schema } from "mongoose";
import { BaseModel } from './BaseModel';
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema: Schema = new Schema({
	password: String,
	username: {
		type: String,
		required: true
	},
	recipes: [Schema.Types.ObjectId]
});

export class User extends BaseModel {
	username: string;
	recipes: any[];

	static register(user: User, password: string, fn: (err: any, user: User) => void) { }
	static authenticate() { }
	static serializeUser() { }
	static deserializeUser() { }
}

userSchema.plugin(passportLocalMongoose);

// userSchema.add({ users: [Schema.Types.ObjectId] })

exports.User = model("User", userSchema);
