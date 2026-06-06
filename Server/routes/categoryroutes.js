const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controlers/categoryControlers.js');


router.get('/', getAllCategories);
router.get('/id/:id', getCategoryById);
router.get('/name/:name', getCategoryByName);

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
