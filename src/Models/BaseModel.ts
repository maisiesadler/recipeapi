import { Schema } from "mongoose";
export class BaseModel {
	_id: string

	constructor(model: any) {
	}

	save(): Promise<void> { return null; }
	set(setter: any) { }
	toObject(): any { }
	static modelName: string;

	static find<T>(query, projection?): IExecutor<T> {
		return null;
	}
	static findOne<T>(query): IOneExecutor<T> {
		return null;
	}
	static findById<T>(id): IOneExecutor<T> {
		return null;
	}
	static count<T>(query: any): IOneExecutor<T> {
		return null;
	}
}

export interface IExecutor<T> {
	exec(): Promise<T[]>;
	limit(limit: number): IExecutor<T>;
	sort(orderBy: any): IExecutor<T>;
}

export interface IOneExecutor<T> {
	exec(): Promise<T>;
}
