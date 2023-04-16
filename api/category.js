const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { isAuth, isAdmin } = require("../middlewares/isAuth");
const { celebrate, Joi } = require("celebrate");
const {
  addNewCat,
  getAllCat,
  getCatById,
  updateCatById,
  deleteCatById,
} = require("../services/category");

// create new category
router.post(
  "/",
  // data validation middleware
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
    }),
  }),
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    try {
      const catDTO = req.body;

      const newCat = await addNewCat(catDTO);

      res.json(newCat);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// get all category
router.get(
  "/",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    try {
      const findAllCat = await getAllCat();

      res.json(findAllCat);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// get category by id
router.get(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const getCat = await getCatById(id);

      res.json(getCat);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// update category by id
router.put(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const data = req.body;
      const getCat = await updateCatById(id, data);

      res.json(getCat);
    } catch (error) {
      throw new Error(error);
    }
  })
);

// delete category by id
router.delete(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCat = await deleteCatById(id);

      res.json(deletedCat);
    } catch (error) {
      throw new Error(error);
    }
  })
);

module.exports = router;
