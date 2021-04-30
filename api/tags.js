const express = require("express");
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    message: "Get All Tags request response",
    tags: tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params;

  try {
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
    const allPosts = await getPostsByTagName(tagName);
    const posts = allPosts.filter((post) => {
      if (post.active) {
        return true;
      }
      if (req.user && req.user.id === post.author.id) {
        return true;
      }
      return false;
    });

    res.send({ posts });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
