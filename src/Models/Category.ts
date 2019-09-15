import { model, Schema } from "mongoose";
import { BaseModel } from './BaseModel';

var categorySchema = new Schema({
    name: String,
})

export class Category extends BaseModel {
    name: string;
}

exports.Category = model("r_Category", categorySchema);
