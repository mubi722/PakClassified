const express = require('express');
const router = express.Router();
const { uploadAds } = require('../middleware/upload.js');
const {
  createadvertisement,
  getalladd,
  getoneadd,
  updateadd,
  deleteadd,
  searchAds,
  getCities,
  getCategories,
  getTypes
} = require('../controlers/addControlers.js');

const authenticateUser = (req, res, next) => {
  req.userId = req.headers['user-id'] || req.body.userId;
  if (!req.userId) {
    return res.status(401).json({ message: 'User ID is required' });
  }
  next();
};

// Create new ad
router.post('/', authenticateUser, uploadAds.array('images', 5), createadvertisement);
// Get all ads
router.get('/', getalladd);
// Get all categories
router.get('/categories/all', getCategories);
// Get all cities
router.get('/cities', getCities);
// Get all types (must remain before /:id)
router.get('/types', getTypes);
// Search ads by city, category, or user
router.get('/search', searchAds);
// Get one ad by id
router.get('/:id', getoneadd);
// Update ad by id
router.put('/:id', authenticateUser, uploadAds.array('images', 5), updateadd);
// Delete ad by id
router.delete('/:id', deleteadd);

module.exports = router;
