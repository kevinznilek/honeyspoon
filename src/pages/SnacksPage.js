import React, { useState, useRef, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import Quagga from 'quagga';

const SnacksPage = ({ user, isMobile }) => {
  const [favoriteSnacks, setFavoriteSnacks] = useState([]);
  const [showSnackCreator, setShowSnackCreator] = useState(false);

  const categoryEmojis = {
    'Nuts & Seeds': '🥜',
    'Fresh & Natural': '🍎',
    'Homemade': '🏠',
    'Protein Rich': '🥩',
    'Crunchy': '🥨',
    'Frozen Treats': '🍦',
    'Sweet': '🍬',
    'Other': '🍪'
  };

  const addNewSnack = (newSnack) => {
    const newId = Math.max(...favoriteSnacks.map(snack => snack.id), 0) + 1;
    const snack = {
      id: newId,
      name: newSnack.name,
      emoji: categoryEmojis[newSnack.category] || '🍪',
      category: newSnack.category,
      favorite: newSnack.favorite || null,
      store: newSnack.store
    };
    setFavoriteSnacks(prev => [...prev, snack]);
  };

  const SnackCreatorModal = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedProduct, setScannedProduct] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const scannerRef = useRef(null);
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
      return () => {
        if (Quagga) {
          Quagga.stop();
        }
      };
    }, []);
    
    if (!showSnackCreator) return null;

    const startBarcodeScanning = () => {
      setShowScanner(true);
      setIsScanning(true);
      setScanError(null);
      
      setTimeout(() => {
        if (scannerRef.current) {
          Quagga.init({
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                width: 300,
                height: 200,
                facingMode: "environment"
              }
            },
            decoder: {
              readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader"
              ]
            },
            locate: true
          }, (err) => {
            if (err) {
              console.error('QuaggaJS initialization failed:', err);
              setScanError('Camera access failed. Please allow camera permissions.');
              setIsScanning(false);
              return;
            }
            Quagga.start();
          });

          Quagga.onDetected(async (result) => {
            const barcode = result.codeResult.code;
            console.log('Barcode detected:', barcode);
            
            // Stop scanning
            Quagga.stop();
            setShowScanner(false);
            
            // Fetch product data
            await fetchProductData(barcode);
          });
        }
      }, 100);
    };

    const fetchProductData = async (barcode) => {
      try {
        setIsScanning(true);
        
        // Try OpenFoodFacts API first
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
          const product = data.product;
          const productData = {
            name: product.product_name || product.product_name_en || 'Unknown Product',
            brand: product.brands || 'Unknown Brand',
            category: categorizeProduct(product.categories_tags || []),
            barcode: barcode
          };
          
          setScannedProduct(productData);
          
          // Auto-fill form fields
          const form = document.querySelector('form[data-snack-form]');
          if (form) {
            const nameInput = form.querySelector('input[name="name"]');
            const categorySelect = form.querySelector('select[name="category"]');
            
            if (nameInput) nameInput.value = productData.name;
            if (categorySelect && productData.category) categorySelect.value = productData.category;
          }
        } else {
          setScanError('Product not found in database. Please enter manually.');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setScanError('Failed to fetch product data. Please try again.');
      } finally {
        setIsScanning(false);
      }
    };

    const categorizeProduct = (categoryTags) => {
      const categories = categoryTags.join(' ').toLowerCase();
      
      if (categories.includes('nuts') || categories.includes('seeds')) return 'Nuts & Seeds';
      if (categories.includes('fresh') || categories.includes('fruit') || categories.includes('vegetable')) return 'Fresh & Natural';
      if (categories.includes('protein') || categories.includes('meat') || categories.includes('yogurt')) return 'Protein Rich';
      if (categories.includes('chips') || categories.includes('crackers') || categories.includes('crunchy')) return 'Crunchy';
      if (categories.includes('ice') || categories.includes('frozen')) return 'Frozen Treats';
      if (categories.includes('sweet') || categories.includes('candy') || categories.includes('chocolate') || categories.includes('cookies')) return 'Sweet';
      
      return 'Other';
    };

    const stopScanning = () => {
      if (Quagga) {
        Quagga.stop();
      }
      setShowScanner(false);
      setIsScanning(false);
      setScanError(null);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newSnack = {
        name: formData.get('name'),
        category: formData.get('category'),
        favorite: formData.get('favorite') === 'none' ? null : formData.get('favorite'),
        store: formData.get('store')
      };
      addNewSnack(newSnack);
      setShowSnackCreator(false);
      setScannedProduct(null);
      setIsScanning(false);
      setShowScanner(false);
      setScanError(null);
      if (Quagga) Quagga.stop();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Add New Snack</h3>
            <button 
              onClick={() => {
                setShowSnackCreator(false);
                setScannedProduct(null);
                setIsScanning(false);
                setShowScanner(false);
                setScanError(null);
                if (Quagga) Quagga.stop();
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-snack-form>
            {/* Barcode Scanner Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Add with Barcode</label>
              
              {!showScanner ? (
                <button
                  type="button"
                  onClick={startBarcodeScanning}
                  className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    scannedProduct 
                      ? 'border-green-400 bg-green-50' 
                      : scanError
                        ? 'border-red-400 bg-red-50'
                        : isScanning 
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center py-2">
                    {isScanning ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mb-2"></div>
                        <p className="text-sm text-orange-600 font-medium">Loading product data...</p>
                      </>
                    ) : scannedProduct ? (
                      <>
                        <div className="text-xl mb-1">✅</div>
                        <p className="text-sm text-green-600 font-medium">{scannedProduct.name}</p>
                        <p className="text-xs text-gray-500">{scannedProduct.brand}</p>
                      </>
                    ) : scanError ? (
                      <>
                        <div className="text-xl mb-1">❌</div>
                        <p className="text-sm text-red-600 font-medium">Scan Failed</p>
                        <p className="text-xs text-gray-500">Tap to try again</p>
                      </>
                    ) : (
                      <>
                        <div className="text-xl mb-1">📱</div>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Scan Barcode</span>
                        </p>
                        <p className="text-xs text-gray-400">Live camera scanner</p>
                      </>
                    )}
                  </div>
                </button>
              ) : (
                <div className="relative">
                  <div className="bg-black rounded-xl overflow-hidden">
                    <div ref={scannerRef} className="w-full h-64"></div>
                    <div className="absolute inset-0 border-2 border-orange-400 rounded-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-48 h-32 border-2 border-orange-400 bg-transparent"></div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={stopScanning}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full"
                  >
                    <X size={16} />
                  </button>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Position barcode within the frame
                  </p>
                </div>
              )}
              
              {scanError && (
                <p className="text-sm text-red-600 mt-2">{scanError}</p>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">or add manually</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Snack Name *</label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Enter snack name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select 
                name="category"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                <option value="Nuts & Seeds">Nuts & Seeds</option>
                <option value="Fresh & Natural">Fresh & Natural</option>
                <option value="Homemade">Homemade</option>
                <option value="Protein Rich">Protein Rich</option>
                <option value="Crunchy">Crunchy</option>
                <option value="Frozen Treats">Frozen Treats</option>
                <option value="Sweet">Sweet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Favorite</label>
              <select 
                name="favorite"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="none">No favorite</option>
                <option value="Mom Fave">Mom Fave</option>
                <option value="Dad Fave">Dad Fave</option>
                <option value="Child 1 Fave">Child 1 Fave</option>
                <option value="Child 2 Fave">Child 2 Fave</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store *</label>
              <select 
                name="store"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              >
                <option value="">Where to buy</option>
                <option value="Grocery Store">Grocery Store</option>
                <option value="Walmart">Walmart</option>
                <option value="Target">Target</option>
                <option value="Costco">Costco</option>
                <option value="Whole Foods">Whole Foods</option>
                <option value="Trader Joes">Trader Joes</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowSnackCreator(false);
                  setScannedProduct(null);
                  setIsScanning(false);
                  setShowScanner(false);
                  setScanError(null);
                  if (Quagga) Quagga.stop();
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white"
                style={{backgroundColor: '#F79101'}}
              >
                Add Snack
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
          Favorite Snacks
        </h2>
        <button 
          onClick={() => setShowSnackCreator(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} 
          style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
        >
          {isMobile ? '+ Add' : '+ Add Snack'}
        </button>
      </div>

      {favoriteSnacks.length === 0 ? (
        <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center ${isMobile ? 'rounded-2xl p-10' : ''}`}>
          <div className="text-4xl mb-4">🍪</div>
          <p className="text-gray-500 mb-4">No favorite snacks added yet</p>
          <button
            onClick={() => setShowSnackCreator(true)}
            className={`px-6 py-2 text-white rounded-lg font-medium ${isMobile ? 'px-8 py-3 rounded-xl' : ''}`}
            style={{backgroundColor: '#F79101'}}
          >
            Add Your First Snack
          </button>
        </div>
      ) : (
        <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {favoriteSnacks.map((snack, index) => (
            <div key={index} className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
              <div className={`${isMobile ? 'text-4xl mb-4' : 'text-3xl mb-3'} text-center`}>{snack.emoji}</div>
              <h4 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-lg mb-3' : ''}`}>{snack.name}</h4>
              <div className={`flex flex-wrap gap-1 mb-3 ${isMobile ? 'gap-2 mb-4' : ''}`}>
                <span className={`px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: '#FFF2C7', color: '#8B5A00'}}>
                  {snack.category}
                </span>
                {snack.favorite && (
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: '#FEF7ED', color: '#C2410C'}}>
                    <Heart size={12} fill="currentColor" />
                    {snack.favorite}
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: '#868a9d', color: '#FFFFFF'}}>
                  {snack.store}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <SnackCreatorModal />
    </div>
  );
};

export default SnacksPage;