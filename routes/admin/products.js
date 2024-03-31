const express = require("express");
const multer = require("multer");

const productRepo = require("../../repositories/products");
const newProductTemplate = require("../../views/admin/products/new");
const indexProductsTemplate = require("../../views/admin/products/index");
const editProductTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");
const { handleErrors, requireAuth } = require("./middlewares");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productRepo.getAll();
  res.send(indexProductsTemplate({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(newProductTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(newProductTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productRepo.create({ title, price, image });

    res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productRepo.getOne(req.params.id);

  if (!product) {
    return res.send("Product was not found.");
  }
  res.send(editProductTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(editProductTemplate, async (req) => {
    const product = await productRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }
    try {
      await productRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send("Product was not found.");
    }

    res.redirect("/admin/products");
  }
);

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  try {
    await productRepo.delete(req.params.id);
  } catch (err) {
    return res.send("Product not found");
  }

  res.redirect("/admin/products");
});

module.exports = router;
