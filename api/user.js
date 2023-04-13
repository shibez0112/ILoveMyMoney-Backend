const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { isAuth, isAdmin } = require("../middlewares/isAuth");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../services/user");
const { celebrate, Joi } = require("celebrate");

router.get(
  "/all-users",
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const allUsers = await getAllUsers();
      res.json(allUsers);
    } catch (error) {
      throw new Error(error);
    }
  })
);

router.get(
  "/:id",
  isAuth,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const getUser = await getUserById(id);
      res.json(getUser);
    } catch (error) {
      throw new Error(error);
    }
  })
);

router.delete(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await deleteUser(id);
      res.json(deletedUser);
    } catch (error) {
      throw new Error(error);
    }
  })
);

router.put(
  "/:id",
  // data validation middleware
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const userDTO = req.body;

      const updatedUser = await updateUser(id, userDTO);

      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  })
);

module.exports = router;
