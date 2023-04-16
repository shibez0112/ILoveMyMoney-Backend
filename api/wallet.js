const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { isAuth } = require("../middlewares/isAuth");
const {
  getWalletById,
  addNewWallet,
  getAllWalletByUser,
  deleteWalletById,
  updateWallet,
} = require("../services/wallet");
const { celebrate, Joi } = require("celebrate");

// create new wallet
router.post(
  "/",
  // data validation middleware
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      balance: Joi.number().required(),
    }),
  }),
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const walletDTO = req.body;
      const user_id = req.user.id;

      const newWallet = await addNewWallet(walletDTO, user_id);

      res.json(newWallet);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// Get wallet by id
router.get(
  "/:id",
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const findWallet = await getWalletById(id, user_id);

      res.json(findWallet);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// Get all wallet by user
router.get(
  "/",
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.user;

      const findWallet = await getAllWalletByUser(id);

      res.json(findWallet);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// Delete a wallet by user
router.delete(
  "/:id",
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;

      const deletedWallet = await deleteWalletById(id, user_id);

      res.json(deletedWallet);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// Update a wallet
router.put(
  "/:id",
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      balance: Joi.number().required(),
    }),
  }),
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const data = req.body;

      const updatedWallet = await updateWallet(id, user_id, data);

      res.json(updatedWallet);
    } catch (error) {
      throw new Error(error);
    }
  })
);

module.exports = router;
