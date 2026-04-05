import { expect } from "chai";
import authMiddleware from "../middleware/isAuth.js";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import e from "express";
//unit test for auth middleware

describe("Auth Middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: function () {
        return null;
      }, //creating a mock request object with a get method that returns null to simulate the absence of the authorization header
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated.",
    ); //expecting the auth middleware to throw an error with the message "Not authenticated."
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: function () {
        return "xyz"; //creating a mock request object with a get method that returns a string without a space to simulate an invalid authorization header format
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(); //expecting the auth middleware to throw an error due to the invalid format of the authorization header
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: function () {
        return "Bearerxyz"; //creating a mock request object with a get method that returns a string without a space to simulate an invalid authorization header format
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(); //expecting the auth middleware to throw an error due to the invalid format of the authorization header
  });

  it("should yield a userId after decoding the token", () => {
    const req = {
      get: function () {
        return "Bearer  dsvdafasd";
      },
    };
    //mocking the jwt.verify method to return a decoded token with a userId property, allowing us to test the successful decoding of the token and the assignment of the userId to the request object
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).have.property("userId", "abc"); //expecting the request object to have a userId property and that it is equal to "abc", confirming that the token was successfully decoded and the userId was correctly assigned to the request object
    expect(jwt.verify.called).to.be.true; //expecting the jwt.verify method to have been called during the execution of the auth middleware, confirming that the token verification process was initiated
    jwt.verify.restore(); //restoring the original jwt.verify method after the test to ensure that it does not affect other tests or parts of the application
  });
});
