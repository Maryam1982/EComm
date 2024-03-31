const Repositories = require("./repository");

class CartRepository extends Repositories {}

module.exports = new CartRepository("carts.json");
