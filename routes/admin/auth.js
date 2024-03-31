const express = require("express");

const { handleErrors } = require("./middlewares");
const userRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  emailExists,
  validPassword,
} = require("./validators");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    //Create a user in the user repository that represents this person
    const user = await userRepo.create({ email, password });

    //Store id of that user in the user's cookie
    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are signed out.");
});

router.get("/signin", async (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [emailExists, validPassword],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await userRepo.getOneBy({ email });

    req.session.userId = user[0].id;
    res.redirect("/admin/products");
  }
);

module.exports = router;
