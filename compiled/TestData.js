// import { DbApi } from "./DbApi";
// import { User, YoEvent } from "./Models";
// loadDb()
// 	.then(() => {
// 		console.log('done');
// 		process.exit(0);
// 	});
// async function loadDb() {
// 	await DbApi.connect();
// 	// await generateEvents();
// 	await generateUsers();
// 	// await generateIntegrations();
// }
// async function generateEvents() {
// 	var model = new YoEvent({
// 		title: 'string;',
// 		message: 'string;'
// 	});
// 	var result = await model.save();
// }
// async function generateUsers() {
// 	await (User as any).deleteMany({})
// 	var model = new User({
// 		email: 'Maisie1'
// 	});
// 	var result = await model.save();
// }
// // async function generateCustomers() {
// // 	console.log('adding customers');
// // 	dbo.collection("customer").drop(function (err, db) {
// // 		console.log(err);
// // 	});
// // 	var customer1 = new Customer();
// // 	customer1.name = "Spreadex";
// // 	await dbo.collection("customer").insertOne(customer1);
// // 	var customer2 = new Customer();
// // 	customer2.name = "McDonalds";
// // 	await dbo.collection("customer").insertOne(customer2);
// // }
// // async function generateIntegrations() {
// // 	await dbo.collection("integrations").drop(function (err, db) {
// // 		console.log(err);
// // 	});
// // }
//# sourceMappingURL=TestData.js.map