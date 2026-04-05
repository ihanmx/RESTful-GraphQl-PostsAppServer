import "dotenv/config";
import { expect } from "chai";
import sinon from "sinon";
import User from "../models/user.js";
import Post from "../models/post.js";
import { createPost } from "../controllers/feed.js";
import mongoose from "mongoose";

describe("Feed controller - createPost", () => {
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

  it("should add a created post to the user's posts and posts collection", async function () {
    this.timeout(10000);
    const req = {
      body: {
        title: "Test Post",
        content: "This is a test post.",
      },
      file: { path: "images/test.jpg" },
      userId: "64b8c0f1f1f1f1f1f1f1f1f1",
    };
    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };

    // stub getIO to avoid socket error in test
    sinon.stub(mongoose.Model.prototype, "save").callThrough();

    await createPost(req, res, () => {});

    const user = await User.findById("64b8c0f1f1f1f1f1f1f1f1f1");
    const post = await Post.findOne({ title: "Test Post" });

    expect(res.statusCode).to.equal(201);
    expect(post).to.not.be.null;
    expect(user.posts).to.have.lengthOf(1);

    mongoose.Model.prototype.save.restore();
  });

  after(async function () {
    this.timeout(10000);
    await Post.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
