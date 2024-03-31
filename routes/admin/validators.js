const { check } = require("express-validator");
const userRepo = require("../../repositories/users");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("Must be between 5 and 40 characters"),
  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Must be a number greater than or equal to 1"),
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const rec = await userRepo.getOneBy({ email });
      if (rec) {
        throw new Error("Email in use.");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password length must be between 4 and 20 characters."),
  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password length must be between 4 and 20 characters.")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match.");
      }
    }),
  emailExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const rec = await userRepo.getOneBy({ email });
      if (rec.length === 0) {
        throw new Error("Email does not exist.");
      }
    }),
  validPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const rec = await userRepo.getOneBy({ email: req.body.email });
      if (rec.length === 0) {
        throw new Error("Invalid password.");
      }
      if (!(await userRepo.comparePasswords(rec[0].password, password))) {
        throw new Error("Invalid password.");
      }
    }),
};
