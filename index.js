const express = require("express");
const bodyParser = require("body-parser");
const coockieSession = require("cookie-session");
const auhtRouter = require("./routes/admin/auth");
const adminProductRouter = require("./routes/admin/products");
const productRouter = require("./routes/products/products");
const cartRouter = require("./routes/carts/carts");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(coockieSession({ keys: ["manskjansdnjk"] }));
app.use(auhtRouter);
app.use(productRouter);
app.use(adminProductRouter);
app.use(cartRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
