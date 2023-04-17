const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { isAuth } = require("../middlewares/isAuth");
const { celebrate, Joi } = require("celebrate");
const {
  addNewTrans,
  findTransWithId,
  findAllTrans,
  deleteTransWithId,
  updateTransWithId,
} = require("../services/transaction");

// create new transaction
router.post(
  "/",
  // data validation middleware
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      amount: Joi.number().required(),
      type: Joi.boolean().required(),
      category_id: Joi.number().required(),
      wallet_id: Joi.number().required(),
    }),
  }),
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const transDTO = req.body;

      const newTrans = await addNewTrans(transDTO);

      res.json(newTrans);
    } catch (error) {
      throw new Error(error);
    }
  })
);

//get all transactions
router.get(
  "/",
  isAuth,
  asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    try {
      const findedAllTrans = await findAllTrans(user_id);

      res.json(findedAllTrans);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// get a transaction
router.get(
  "/:id",
  isAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const findTrans = await findTransWithId(id);

      res.json(findTrans);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// delete a transaction
router.delete(
  "/:id",
  isAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deletedTrans = await deleteTransWithId(id);

      res.json(deletedTrans);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// update a transaction
router.put(
  "/:id",
  isAuth,
  asyncHandler(async (req, res) => {
    const transDTO = req.body;
    const { id } = req.params;
    try {
      const updatedTrans = await updateTransWithId(transDTO, id);

      res.json(updatedTrans);
    } catch (error) {
      throw new Error(error);
    }
  })
);

module.exports = router;
