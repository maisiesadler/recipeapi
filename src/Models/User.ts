import { model, Schema } from "mongoose";
import { BaseModel } from './BaseModel';
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema: Schema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: String,
	name: String,
	recipes: [Schema.Types.ObjectId]
});

export class User extends BaseModel {
	email: string;
	name?: string;
	recipes: any[];

	static register(user: User, password: string, fn: (err: any, user: User) => void) { }
	static authenticate() { }
	static serializeUser() { }
	static deserializeUser() { }
}

userSchema.plugin(passportLocalMongoose);

// userSchema.add({ users: [Schema.Types.ObjectId] })

exports.User = model("r_User", userSchema);
