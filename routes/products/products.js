const express = require("express");
const indexProductTemplate = require("../../views/products/index");
const productRepo = require("../../repositories/products");
const cartRepo = require("../../repositories/carts");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await productRepo.getAll();
  const cart = await cartRepo.getOne(req.session.cartId);
  res.send(indexProductTemplate({ products, cart }));
});

module.exports = router;
