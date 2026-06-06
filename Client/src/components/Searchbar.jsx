import { useState, useEffect } from "react";
import axios from "axios";
import { Collapse, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch categories & cities from database
  useEffect(() => {
    fetchCategories();
    fetchCities();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ads/categories/all");
      // server returns { message, categories }
      setCategories(res.data.categories || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ads/cities");
      // server returns { message, cities }
      setCities(res.data.cities || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ads/search", {
        params: { keyword, category, city }
      });

      setResults(res.data.ads || []);
      setOpen(true); // show collapse section
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Search Bar Section */}
      <div className="p-3 shadow d-flex justify-content-between align-items-center w-100 bg-success" style={{ gap: '15px' }}>
        {/* Keyword Search */}
        <input
          type="text"
          className="form-control"
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {/* Category Dropdown */}
        <select
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={cat._id || cat.name || idx} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          className="form-control"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select City Area</option>
          {cities.map((c, idx) => (
            <option key={c._id || c.name || idx} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <Button
          variant="dark"
          className="flex-shrink-0"
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} /> Search
        </Button>
      </div>

      {/* Results Section - Separate from Search Bar */}
      {open && (
        <div className="container my-5">
          <h3 className="text-center text-success mb-4">Search Results</h3>
          {results.length === 0 ? (
            <div className="alert alert-info text-center">No results found.</div>
          ) : (
            <div className="row">
              {results.map((item) => (
                <div key={item._id} className="col-md-6 col-lg-4 mb-4">
                  <Card className="h-100 shadow-sm">
                    {item.images && item.images.length > 0 && (
                      <Card.Img variant="top" src={item.images[0]} style={{ height: '200px', objectFit: 'cover' }} />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text className="text-muted small flex-grow-1">
                        {item.description?.substring(0, 100)}...
                      </Card.Text>
                      <div className="mt-auto">
                        <p className="fw-bold text-success mb-2">Rs. {item.price}</p>
                        <Button variant="success" size="sm" href={`/details/${item._id}`}>
                          More Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBar;
