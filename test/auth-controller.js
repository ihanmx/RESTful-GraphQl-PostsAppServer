import "dotenv/config";
import { expect } from "chai";
import sinon from "sinon";
import User from "../models/user.js";
import { postLogin } from "../controllers/auth.js";
import { getStatus } from "../controllers/status.js";
import mongoose from "mongoose";

describe("Auth controller - login", () => {
  it("should throw an error if access to the database fails", async () => {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@example.com",
        password: "password",
      },
    };

    let caughtError;
    await postLogin(req, {}, (err) => {
      caughtError = err;
    });
    expect(caughtError).to.be.an("error");
    expect(caughtError).to.have.property("statusCode", 500);

    User.findOne.restore();
  });
});

describe("Status controller - getStatus", () => {
  before(async function () {
    this.timeout(10000);
    await mongoose.connect(process.env.MONGO_URI);
    const user = new User({
      email: "test@example.com",
      password: "password",
      name: "Test User",
      posts: [],
      _id: "64b8c0f1f1f1f1f1f1f1f1f1",
    });
    await user.save();
  });

  it("should send a response with a valid user status for an existing user", async function () {
    this.timeout(10000);
    const req = { userId: "64b8c0f1f1f1f1f1f1f1f1f1" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    await getStatus(req, res, () => {});

    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal("I am new!");
  });

  after(async function () {
    this.timeout(10000);
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
