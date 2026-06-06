import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavbarComponent from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Carousel from './components/Carouselcomp'
import Searchbar from './components/Searchbar'
import Categories from './components/Categories'
import AdvertisementListing from './components/AdvertisementListing'
import CarDetails from './components/CarDetails'
import UserProfile from './components/UserProfile'
import Footer from './components/Footer'
import VerifyOtp from './components/VerifyOtp'

function App() {
  const isLoggedIn = !!localStorage.getItem('userId');

  return (
    <>
      <Router>
        <NavbarComponent />

        <Routes>
          <Route path='/' element={
            <>
              <Carousel />
              <Searchbar />
              <Categories />
              <Home />
            </>
          } />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route
            path='/profile'
            element={isLoggedIn ? <UserProfile /> : <Navigate to='/' replace />}
          />
          <Route path='/categories' element={<Categories />} />
          <Route path='/category/:slug' element={<AdvertisementListing />} />
          <Route path='/details/:id' element={<CarDetails />} />
        </Routes>

        <Footer />
      </Router>
    </>
  )
}

export default App
