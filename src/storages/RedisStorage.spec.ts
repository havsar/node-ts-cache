// import * as Assert from "assert";
// import { RedisStorage } from './RedisStorage';

// const secret = require("../../secret.json");

// const storage = new RedisStorage(secret.host, secret.port, secret.password);

// describe("RedisStorage", () => {
//     it("Should clear Redis without errors", async () => {
//         await storage.clear();
//     });

//     it("Should set item without errors", async () => {
//         await storage.setItem("test", "hello");
//     });

//     it("Should set and get item correctly", async () => {
//         storage.clear();
//         const key = "user";
//         const value = "admin";

//         await storage.setItem(key, value);
//         const resp = await storage.getItem(key);

//         Assert.equal(resp, value);
//     });

//     it("Should return undefined if key not found", async () => {
//         storage.clear();
//         const key = "user";

//         const item = await storage.getItem(key);

//         Assert.equal(item, undefined);
//     });
// });