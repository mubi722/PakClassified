import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal.jsx';
import SignupModal from './SignupModal.jsx';
import PostAdModal from './PostAdModal.jsx';
import axios from 'axios';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPostAd, setShowPostAd] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  const getImageUrl = (imagePath) => {
    console.log('Getting image URL for:', imagePath);
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath}`;
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserImage = localStorage.getItem('userImage');

    setIsLoggedIn(!!userId);
    setUserName(storedUserName || '');
    setUserImage(storedUserImage || '');

    const handleStorageChange = (e) => {
      console.log('Storage changed:', e.key);
      if (e.key === 'userId') {
        setIsLoggedIn(!!e.newValue);
      }
      if (e.key === 'userName') {
        setUserName(e.newValue || '');
      }
      if (e.key === 'userImage') {
        setUserImage(e.newValue || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchCategories = async () => {
    console.log('Fetching categories');
    try {
      setLoadingCategories(true);
      const res = await axios.get('http://localhost:5000/api/ads/categories/all');
      setCategories(res.data.categories || res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoriesClick = () => {
    console.log('Categories clicked');
    if (categories.length === 0) {
      fetchCategories();
    }
  };

  const handleLogout = () => {
    console.log('Logging out');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    setIsLoggedIn(false);
    setUserName('');
    setUserImage('');
    window.location.href = '/';
  };

  return (
    <>
      {/* Top Bar */}
      <div className='bg-gray'>
        <div className='d-flex justify-content-between align-items-center px-3' style={{ minHeight: '50px' }}>
          <span className='text-success fw-bold'>Welcome</span>

          <div className='d-flex align-items-center gap-2'>
            {!isLoggedIn ? (
              <>
                <button className='btn btn-success' onClick={() => setShowLogin(true)}>
                  Login
                </button>
                <button className='btn btn-success' onClick={() => setShowSignup(true)}>
                  Signup
                </button>
              </>
            ) : (
              <div className='dropdown'>
                <button
                  className='btn btn-light d-flex align-items-center gap-2 rounded-circle p-0'
                  type='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                  style={{ width: '45px', height: '45px' }}
                >
                  {userImage ? (
                    <img
                      src={getImageUrl(userImage)}
                      alt='Profile'
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const sibling = e.target.nextElementSibling;
                        if (sibling) {
                          sibling.style.display = 'block';
                        }
                      }}
                    />
                  ) : (
                    <i className='bi bi-person-circle' style={{ fontSize: '1.5rem', color: '#16A34A' }} />
                  )}
                </button>
                <ul className='dropdown-menu dropdown-menu-end'>
                  {userName && <li className='dropdown-header'>{userName}</li>}
                  <li>
                    <Link className='dropdown-item' to='/profile'>
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <hr className='dropdown-divider' />
                  </li>
                  <li>
                    <button className='dropdown-item text-danger' onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className='navbar navbar-expand-md bg-light'>
        <div className='container-fluid'>
          <div className='d-flex align-items-center gap-3'>
            <Link className='text-success navbar-brand fw-bold' to='/'>
              PakClassified
            </Link>
          </div>

          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav'>
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='collapse navbar-collapse justify-content-end' id='navbarNav'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <Link className='nav-link' to='/'>
                  Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/about'>
                  About
                </Link>
              </li>

              {/* Categories Dropdown */}
              <li className='nav-item dropdown'>
                <Link className='nav-link dropdown-toggle' to='#' data-bs-toggle='dropdown' onClick={handleCategoriesClick}>
                  Categories
                </Link>
                <ul className='dropdown-menu'>
                  {loadingCategories ? (
                    <li>
                      <span className='dropdown-item disabled'>Loading...</span>
                    </li>
                  ) : categories.length > 0 ? (
                    categories.map((category, idx) => (
                      <li key={category._id || category.id || category.name || idx}>
                        <Link className='dropdown-item' to={`/category/${category.slug}`}>
                          {category.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className='dropdown-item disabled'>No categories found</span>
                    </li>
                  )}
                </ul>
              </li>

              <li className='nav-item'>
                <Link className='nav-link' to='/contact'>
                  Contact
                </Link>
              </li>
            </ul>

            <div>
              <button onClick={() => setShowPostAd(true)} className='btn btn-success'>
                Post Advertisement →
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
      <SignupModal show={showSignup} handleClose={() => setShowSignup(false)} navigate={(path) => window.location.href = path} />
      <PostAdModal show={showPostAd} handleClose={() => setShowPostAd(false)} />
    </>
  );
};

export default Navbar;
