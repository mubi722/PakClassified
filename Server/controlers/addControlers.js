const  mongoose = require('mongoose');
const Advertisement = require('../modals/Advertisement');

// Get all unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Advertisement.distinct('category');
    const formattedCategories = categories.map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      slug: cat.toLowerCase()
    }));
    return res.status(200).json({ 
      message: 'categories fetched successfully', 
      categories: formattedCategories 
    });
  } catch (error) {
    return res.status(500).json({ message: 'failed to fetch categories', error });
  }
};

// Search ads by city, category, keyword, and/or user
const escapeRegex = (value) => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const normalizeSearchTerm = (value) => {
  return String(value || '').trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
};

exports.searchAds = async (req, res) => {
  try {
    const { city, category, keyword, user } = req.query;
    const filter = {};
    if (city) {
      filter.city = {
        $regex: new RegExp(`^${escapeRegex(normalizeSearchTerm(city))}$`, 'i')
      };
    }
    if (category) {
      filter.category = {
        $regex: new RegExp(`^${escapeRegex(normalizeSearchTerm(category))}$`, 'i')
      };
    }
    if (user) filter.postedBy = user;
    if (keyword) {
      filter.$or = [
        { name: { $regex: escapeRegex(keyword), $options: 'i' } },
        { description: { $regex: escapeRegex(keyword), $options: 'i' } }
      ];
    }
    const ads = await Advertisement.find(filter);
    // Normalize image paths to full URLs
    const normalizedAds = ads.map(ad => {
      let adObj = ad.toObject ? ad.toObject() : ad;
      if (adObj.images && Array.isArray(adObj.images)) {
        adObj.images = adObj.images.map(img => {
          if (!img.startsWith('http')) {
            return `http://localhost:5000/uploads/${img}`;
          }
          return img;
        });
      }
      return adObj;
    });
    return res.status(200).json({ message: 'filtered ads', ads: normalizedAds });
  } catch (error) {
    return res.status(500).json({ message: 'search failed', error });
  }
};


exports.createadvertisement = async (req ,res) =>{

    try{
    const {name ,price , description ,features ,startDate ,endDate ,category,city ,type }=req.body 
  /******************************  validation check ****************************************/
        if (!name || !price || !description || !features || !startDate || !endDate || !category || !city || !type ){
          return res.status(400).json({message:'All fields are required '})
    }
    const images =req.files?req.files.map((f) =>`http://localhost:5000/uploads/adimages/${f.filename}`):[];

   const add = await  Advertisement.create({
    name,
    price : Number(price),
    description,
    features ,
    startDate:new Date(startDate),
    endDate : new Date(endDate),
    category,
    city,
     images,
    type,
    postedBy:req.userId
   })
     res.status(200).json({
    message:'add posted successfuly',add
     });
}
catch(error){
    res.status(500).json({
      message:'add posting failed try again'
    })
}

}
exports.getalladd = async (req, res) => {
  try{
    const { userId } = req.query;
    const filter = {};
    if (userId) filter.postedBy = userId;
    
    const getadd = await Advertisement.find(filter);
    // Normalize image paths to full URLs
    const normalizedAds = getadd.map(ad => {
      let adObj = ad.toObject ? ad.toObject() : ad;
      if (adObj.images && Array.isArray(adObj.images)) {
        adObj.images = adObj.images.map(img => {
          if (!img.startsWith('http')) {
            return `http://localhost:5000/uploads/${img}`;
          }
          return img;
        });
      }
      return adObj;
    });
    return res.status(200).json(normalizedAds);
  } catch (error) {
    return res.status(400).json({ message: 'search all user failed, try again', error });
  }
};

exports.getoneadd = async (req, res) => {
  try{
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid advertisement id' });
    const oneadd = await Advertisement.findById(id).populate('postedBy', 'name loginId email contactNumber image');
    if (!oneadd) return res.status(404).json({ message: 'Advertisement not found' });
    // Normalize image paths to full URLs
    let adObj = oneadd.toObject ? oneadd.toObject() : oneadd;
    if (adObj.images && Array.isArray(adObj.images)) {
      adObj.images = adObj.images.map(img => {
        if (!img.startsWith('http')) {
          return `http://localhost:5000/uploads/${img}`;
        }
        return img;
      });
    }
    return res.status(200).json(adObj);
  } catch (error) {
    return res.status(400).json({ message: 'search user failed, try again', error });
  }
};

exports.updateadd = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid advertisement id' });

    const updateData = {};
    const {
      name,
      price,
      description,
      features,
      startDate,
      endDate,
      category,
      city,
      type,
    } = req.body;

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (category !== undefined) updateData.category = category;
    if (city !== undefined) updateData.city = city;
    if (type !== undefined) updateData.type = type;

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => `http://localhost:5000/uploads/adimages/${file.filename}`);
    }

    const updatead = await Advertisement.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatead) return res.status(404).json({ message: 'Advertisement not found' });
    return res.status(200).json({ message: 'add updated successfully', updatead });
  } catch (error) {
    return res.status(500).json({ message: 'update failed, try again', error });
  }
};

exports.deleteadd = async (req, res) => {
  try{
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid advertisement id' });
    const deletead = await Advertisement.findByIdAndDelete(id);
    if (!deletead) return res.status(404).json({ message: 'Advertisement not found' });
    return res.status(200).json({ message: 'add deleted successfuly', deletead });
  } catch (error) {
    return res.status(500).json({ message: 'delete failed, try again', error });
  }
};

// Get all unique cities
exports.getCities = async (req, res) => {
  try {
    const cities = await Advertisement.distinct('city');
    const formattedCities = cities.map((city) => ({
      id: city,
      name: city
    }));
    return res.status(200).json({ message: 'cities fetched successfully', cities: formattedCities });
  } catch (error) {
    return res.status(500).json({ message: 'failed to fetch cities', error });
  }
};

// Get all unique types
exports.getTypes = async (req, res) => {
  try {
    const types = await Advertisement.distinct('type');
    const formattedTypes = types.map((type) => ({
      id: type,
      name: type
    }));
    return res.status(200).json({ message: 'types fetched successfully', types: formattedTypes });
  } catch (error) {
    return res.status(500).json({ message: 'failed to fetch types', error });
  }
};