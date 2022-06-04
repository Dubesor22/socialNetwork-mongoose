
const request = require("supertest");
const app = require("../main.js");

describe("GET /users", () => {
  test("responds code 200", async() => {
    const res = await request(app).get("/users").send();
    expect(res.statusCode).toBe(200);
  })
});

describe("GET /posts", () => {
  test("responds code 200", async() => {
    const res = await request(app).get("/posts").send();
    expect(res.statusCode).toBe(200);
  })
});


// const mongoose = require('mongoose')
// describe(' ...... ', ()=>{
//   afterAll( async () =>{
//         await mongoose.connection.close()
//     })
// })
