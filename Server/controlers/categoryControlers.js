const Category = require('../modals/Category');
const mongoose = require('mongoose');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        return res.status(200).json({
            message: 'Categories fetched successfully',
            categories
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch categories', error });
    }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category fetched successfully', category });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch category', error });
    }
};

// Get category by name
exports.getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const category = await Category.findOne({ name });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category fetched successfully', category });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch category', error });
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({
            name,
            description,
            image
        });

        return res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create category', error });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, isActive } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name, description, image, isActive },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update category', error });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({
            message: 'Category deleted successfully',
            category
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete category', error });
    }
};
