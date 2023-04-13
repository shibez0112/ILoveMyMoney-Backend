const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const asyncHandler = require("express-async-handler");
const { signUp, signIn } = require("../services/authServices");

router.post(
  "/signup",
  // data validation middleware
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20).required(),
    }),
  }),
  asyncHandler(async (req, res) => {
    try {
      const userDTO = req.body;

      const newUser = await signUp(userDTO);

      res.json(newUser);
    } catch (error) {
      throw new Error(error);
    }
  })
);

router.post(
    "/signin",
    // data validation middleware
    celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
      }),
    }),
    asyncHandler(async (req, res) => {
      try {
        const userDTO = req.body;
  
        const loginUser = await signIn(userDTO);
  
        res.json(loginUser);
      } catch (error) {
        throw new Error(error);
      }
    })
  );

module.exports = router;
