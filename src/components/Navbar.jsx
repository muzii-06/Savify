import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars, FaCamera } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Webcam from 'react-webcam';

import Categories from './Categories';
import savifylogo from './Savify logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar = ({ username, isAuthenticated, cart = [] }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  


  // State variables for camera options
  const [showCameraOptionsModal, setShowCameraOptionsModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const webcamRef = useRef(null); // Ref for the webcam component
  const fileInputRef = useRef(null); // Ref for the file input
  const captureIntervalRef = useRef(null); // Ref for the capture interval

  const categories = [
    {
      name: 'Electronics',
      subcategories: ['Mobile Phones', 'Laptops', 'Headphones', 'Cameras'],
    },
    {
      name: 'Fashion',
      subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
    },
    {
      name: 'Home Appliances',
      subcategories: ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom'],
    },
    {
      name: 'Books',
      subcategories: ['Fiction', 'Non-Fiction', 'Textbooks', 'Comics'],
    },
    {
      name: 'Toys',
      subcategories: ['Action Figures', 'Board Games', 'Puzzles', 'Dolls'],
    },
  ];


  const cartItemCount = cart?.length || 0;




  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('sellerToken');
    window.location.href = '/';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCameraClick = () => {
    setShowCameraOptionsModal(true); // Open the options modal
  };

  const handleCameraOptionSelect = (option) => {
    setShowCameraOptionsModal(false);
    if (option === 'automatic') {
      setShowCameraModal(true);
      setIsCapturing(true); // Start capturing frames for automatic detection
    } else if (option === 'capture') {
      setShowCameraModal(true);
      setIsCapturing(false); // Manual capture
    } else if (option === 'select') {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Automatic capturing logic
  useEffect(() => {
    if (isCapturing) {
      captureIntervalRef.current = setInterval(() => {
        captureFrameAndPredict();
      }, 1000); // Capture a frame every 1 second
    }

    // Cleanup on unmount or when isCapturing changes
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
    };
  }, [isCapturing]);

  const stopCapturing = () => {
    setIsCapturing(false);
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  const captureFrameAndPredict = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          // Convert base64 image to a File object
          const blob = await (await fetch(imageSrc)).blob();
          const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' });
  
          // Send the image file to the backend for prediction
          const result = await detectClassFromImage(file);
  
          // Check if result is a valid array of predictions
          if (result && result.length > 0) {
            const highestConfidencePrediction = result.reduce(
              (prev, current) => (prev.confidence > current.confidence ? prev : current)
            );
  
            // Lowered confidence threshold to 0.45 for better real-time detection
            if (highestConfidencePrediction.confidence >= 0.60) {
              stopCapturing();
              setShowCameraModal(false);
  
              const className = highestConfidencePrediction.name;  // Correct key
              setSearchQuery(className);
  
              // Trigger search after setting query visually
              setTimeout(() => {
                navigate(`/search?query=${encodeURIComponent(className)}`);
              }, 100);
            }
          } else {
            console.log('No confident predictions detected.');
          }
        } catch (error) {
          console.error('Error detecting class from image:', error);
        }
      }
    }
  };
  

  // Manual capture functions
  const handleCapture = () => {
    // Capture the image from the webcam
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleRetake = () => {
    // Allow the user to retake the image
    setCapturedImage(null);
  };

  const handleSubmitCapturedImage = async () => {
    if (capturedImage) {
      setIsProcessing(true);
  
      try {
        const blob = await (await fetch(capturedImage)).blob();
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
  
        const predictions = await detectClassFromImage(file);
  
        if (predictions && predictions.length > 0) {
          // Optionally find the most confident prediction
          const highestConfidencePrediction = predictions.reduce(
            (prev, current) => (prev.confidence > current.confidence ? prev : current)
          );
  
          // Optional: skip low-confidence predictions (< 0.45)
          if (highestConfidencePrediction.confidence >= 0.60) {
            const className = highestConfidencePrediction.name;
  
            // 🔥 Trigger UI update and auto-navigation
            setSearchQuery(''); // Clear first to refresh the input visually
            setTimeout(() => {
              setSearchQuery(className); // Show detected class in search input
              navigate(`/search?query=${encodeURIComponent(className)}`); // Trigger search
            }, 100);
          } else {
            alert('No confident objects detected in the image.');
          }
        } else {
          alert('No objects detected in the image.');
        }
      } catch (error) {
        console.error('Error detecting class from image:', error);
        alert('Error detecting class from image.');
      } finally {
        setIsProcessing(false);
        setCapturedImage(null); // Reset after processing
      }
    }
  };
  
  
  
  

  const handleImageSelection = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsProcessing(true);
      try {
        const predictions = await detectClassFromImage(file);
  
        if (predictions && predictions.length > 0) {
          const highestConfidencePrediction = predictions.reduce(
            (prev, current) => (prev.confidence > current.confidence ? prev : current)
          );
  
          if (highestConfidencePrediction.confidence >= 0.2) {
            const className = highestConfidencePrediction.name;
  
            setSearchQuery('');
            setTimeout(() => {
              setSearchQuery(className);
              navigate(`/search?query=${encodeURIComponent(className)}`);
            }, 100);
          } else {
            alert('No confident objects detected.');
          }
        } else {
          alert('No objects detected in the image.');
        }
      } catch (error) {
        console.error('Error detecting class from image:', error);
        alert('Error detecting class from image');
      } finally {
        setIsProcessing(false);
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      }
    }
  };
  

  const detectClassFromImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("📦 Response from backend:", data);
  
        // Return correct array
        if (data.predictions && Array.isArray(data.predictions)) {
          return data.predictions;
        } else {
          console.warn("⚠️ No predictions array found");
          return [];
        }
      } else {
        console.error("❌ Backend error:", response.statusText);
        return [];
      }
    } catch (err) {
      console.error("❌ Error in detection:", err);
      return [];
    }
  };
  
  
  

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar p-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <Link className="navbar-brand" to="/">
            <img src={savifylogo} alt="Savify" width={100} />
          </Link>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-dark rounded-circle me-3"
              onClick={() => setShowSidebar(true)}
            >
              <FaBars />
            </button>

            {/* Updated Search Bar with Camera Icon */}
            <form className="d-flex align-items-center" onSubmit={handleSearch}>
              <input
                type="search"
                className="form-control border-none me-2 search-input rounded-5 navsearch"
                placeholder="Search in Savify"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isProcessing}
              />
              <button
                type="button"
                className="btn"
                onClick={handleCameraClick}
                disabled={isProcessing}
              >
                <FaCamera size={30} />
              </button>
              <button type="submit" className="btn" disabled={isProcessing}>
                <FaSearch size={30} />
              </button>
            </form>

            <Link to="/cart" className="nav-link position-relative ms-3">
  <FaShoppingCart size={30} className="cart-icon" />
  {cartItemCount > 0 && (
    <span className="cart-count-badge">{cartItemCount}</span>
  )}
</Link>




          </div>

          <div className="d-flex align-items-center">
            <Link to="/help" className="nav-link">
              HELP & SUPPORT
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/seller-login" className="nav-link me-3 ">
                  SELL ON SAVIFY
                </Link>
                <Link
                  to="/login"
                  className="btn btn-dark rounded-pill btn-primary me-2"
                >
                  LOGIN
                </Link>
                <Link to="/signup" className="btn btn-dark rounded-pill ">
                  SIGN UP
                </Link>
              </>
            ) : (
              <div className="dropdown me-5">
                <span
                  className="nav-link fw-bold text-primary dropdown-toggle d-flex align-items-center gap-1"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="m-0 p-0 text-uppercase">{username}'s Account</p>
                </span>
                {showDropdown && (
                  <ul className="dropdown-menu dropdown-menu-right show">
                    <li>
                        <Link className="dropdown-item" to="/edit-profile">
                          Edit Profile
                        </Link>
                      </li>

                      <li>
  <Link className="dropdown-item" to="/manage-orders-buyer">
    Manage Orders
  </Link>
</li>

                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`sidebar-overlay ${showSidebar ? 'show' : ''}`}
        onClick={() => setShowSidebar(false)}
      >
        <div
          className={`sidebar-container ${showSidebar ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sidebar-header d-flex justify-content-between align-items-center">
            <h5 className="text-center m-auto fw-bold">Categories</h5>
            <button
              className="btn-close"
              onClick={() => setShowSidebar(false)}
            ></button>
          </div>
          <Categories categories={categories} setShowSidebar={setShowSidebar} />
        </div>
      </div>
      
        
      {/* Camera Options Modal */}
      <Modal
        show={showCameraOptionsModal}
        onHide={() => setShowCameraOptionsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className='fw-bolder fs-4'>Select Option</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          
        <Button
            variant="success"
            className="me-2 rounded-pill mb-3 bg-warning text-dark border-0 "
            onClick={() => handleCameraOptionSelect('capture')}
          >
            Capture from Camera
          </Button>

          
          <Button
            variant="secondary"
            className='rounded-pill mb-3  bg-warning text-dark border-0'
            onClick={() => handleCameraOptionSelect('select')}
          >
            Select Image
          </Button>
          <Button
            variant="primary"
            className="me-2 rounded-pill mb-3 bg-dark border-0 "
            onClick={() => handleCameraOptionSelect('automatic')}
          >
            Automatic Detection
          </Button>
          <h6 className='text-danger text-start fw-bold'>Note that:</h6>
          <p className='text-secondary fs-6 m-0 p-0 text-start'>•Make sure the object is near.</p>
          <p className='text-secondary fs-6 m-0 p-0 text-start'>•Make sure camera is clear.</p>
          <p className='text-secondary fs-6 m-0 p-0 text-start'>•Make sure Lightning is perfect.</p>
          <p className='text-secondary fs-6 m-0 p-0 text-start'>•For automatic detection hold the item still.</p>
        </Modal.Body>
      </Modal>

      {/* Camera Modal */}
      <Modal
        show={showCameraModal}
        onHide={() => {
          setShowCameraModal(false);
          stopCapturing();
          setCapturedImage(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isCapturing ? 'Automatic Detection' : 'Capture Image'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {capturedImage ? (
            <>
              <img src={capturedImage} alt="Captured" style={{ width: '100%' }} />
              <div className="mt-3">
                <Button variant="secondary" onClick={handleRetake} className="me-2">
                  Retake
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitCapturedImage}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Use Image'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                ref={webcamRef}
                videoConstraints={{
                  facingMode: 'environment',
                }}
                style={{ width: '100%' }}
              />
              {isCapturing ? (
                <>
                  <p className="mt-3">Point the camera at an object.</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCameraModal(false);
                      stopCapturing();
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={handleCapture} className="mt-3">
                    Capture
                  </Button>
                </>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Hidden File Input for Selecting Images */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageSelection}
      />

      {/* Sidebar and other components remain the same */}
      {/* ... */}
    </>
  );
};

export default Navbar;
