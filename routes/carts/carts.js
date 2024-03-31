const express = require("express");
const cartRepo = require("../../repositories/carts");
const productRepo = require("../../repositories/products");
const indexCartTemplate = require("../../views/carts/show");

const router = express.Router();

//Router for GET to show all items in the shopping cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect("/");
  }
  const cart = await cartRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productRepo.getOne(item.id);
    item.product = product;
  }

  res.send(indexCartTemplate({ items: cart.items, cart }));
});
//Router for POST to add items to the shopping cart
router.post("/cart/products", async (req, res) => {
  //Figure out the cart (whether this is a new user or already has a cart)
  let cart;
  if (!req.session.cartId) {
    //User is new and there is no cartId
    //Create a new cart and assign its id to session.cartId
    cart = await cartRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    //There is a cart and we just need to find it using cartRepo
    cart = await cartRepo.getOne(req.session.cartId);
  }
  //Check if this productId already exists in this cart-in this case we increase quantity by 1
  //if it does not exist we add a new record with this productId
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  try {
    await cartRepo.update(cart.id, { items: cart.items });
  } catch (err) {
    return res.send(err);
  }

  res.redirect("/");
});

//Router for POST deleting items from the shopping cart
router.post("/cart/products/delete", async (req, res) => {
  const cart = await cartRepo.getOne(req.session.cartId);
  const cartItems = cart.items.filter(
    (item) => item.id !== req.body.cartItemId
  );
  try {
    await cartRepo.update(req.session.cartId, { items: cartItems });
  } catch (err) {
    return res.send("Item was not found");
  }

  res.redirect("/cart");
});

module.exports = router;
