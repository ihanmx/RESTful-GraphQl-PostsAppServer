import { expect } from "chai";
import authMiddleware from "../middleware/isAuth.js";

//unit test for auth middleware

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
