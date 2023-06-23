const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const expect = chai.expect;

const app = require("../app");

const fs = require("fs");
const dotenv = require("dotenv");
const configData = fs.readFileSync(".testing.env");
const buf = Buffer.from(configData);
const config = dotenv.parse(buf);
const mongoose = require("mongoose");

//set test environment
app.set("port", config.port);

describe("check db connection", () => {
  before(async function () {
    await mongoose.connect(`${config.MONGO_URL}/${config.DB}`);
  });
  describe("authorization scenarios", () => {
    it("wrong username and wrong password", (done) => {
      chai
        .request(app)
        .post("/users/login")
        .send({ userName: "nika7770", password: "__123" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
    it("wrong username and correct password", (done) => {
      chai
        .request(app)
        .post("/users/login")
        .send({ userName: "nikaaaa", password: "123" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
    it("correct username and wrong password", (done) => {
      chai
        .request(app)
        .post("/users/login")
        .send({ userName: "nika", password: "sdfasfsaf" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
    it("correct username and correct password", (done) => {
      chai
        .request(app)
        .post("/users/login")
        .send({ userName: "nika", password: "123" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setImmediate(done);
        });
    });
  });
});
