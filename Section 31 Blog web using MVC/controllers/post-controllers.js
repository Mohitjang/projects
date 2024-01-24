const { ServerDescription } = require("mongodb");
const Post = require("../models/post");
const sessionValidation = require("../util/validation-session");
const validationSession = require("../util/validation-session");
const validation = require("../util/validation");

function getHome(req, res) {
  res.render("welcome", { csrfToken: req.csrfToken() });
}

async function getAdmin(req, res) {
  // using models:-
  const posts = await Post.fetchAll();

  // using util:-
  const sessionErrorData = sessionValidation.getSessionErrorData(req, {
    title: "",
    content: "",
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionErrorData,
    csrfToken: req.csrfToken(),
  });
}

async function createPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  // util:-
  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect("/admin");
      }
    );

    return; // or return res.redirect('/admin'); => Has the same effect
  }

  // using models:-
  const post = new Post(enteredTitle, enteredContent);
  await post.save();

  res.redirect("/admin");
}

async function getSinglePost(req, res, next) {
  // using models:-
  let post;
  try {
    post = new Post(null, null, req.params.id);
  } catch (error) {
    // next(error);
    return res.render("404", { csrfToken: req.csrfToken() });
  }
  const postData = await post.fetch();

  if (!postData.title || !postData.content) {
    return res.render("404", { csrfToken: req.csrfToken() }); // 404.ejs is missing at this point - it will be added later!
  }

  //   using util:-
  const sessionErrorData = sessionValidation.getSessionErrorData(req, {
    title: postData.title,
    content: postData.content,
  });

  res.render("single-post", {
    post: postData,
    inputData: sessionErrorData,
    csrfToken: req.csrfToken(),
  });
}

async function updatePost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  // util:-
  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );
    return;
  }

  //using models:-
  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  // using models:-
  const post = new Post(null, null, req.params.id);
  await post.delete();

  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  createPost: createPost,
  getSinglePost: getSinglePost,
  updatePost: updatePost,
  deletePost: deletePost,
};
