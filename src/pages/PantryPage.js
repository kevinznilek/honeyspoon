import React, { useState } from 'react';

const PantryPage = ({ user, isMobile }) => {
  const [pantryImage, setPantryImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [scanResults, setScanResults] = useState(null);

  // Mock detected ingredients for demo purposes
  const mockIngredients = [
    'Tomatoes', 'Onions', 'Garlic', 'Olive Oil', 'Pasta', 'Cheese', 'Basil', 
    'Chicken Breast', 'Bell Peppers', 'Rice', 'Black Beans', 'Lime', 'Avocado'
  ];

  // Mock recipe suggestions based on detected ingredients
  const mockRecipes = [
    {
      id: 1,
      name: 'Pasta Primavera',
      image: '🍝',
      ingredients: ['Pasta', 'Tomatoes', 'Bell Peppers', 'Garlic', 'Olive Oil'],
      time: '25 min',
      difficulty: 'Easy'
    },
    {
      id: 2,
      name: 'Chicken Stir Fry',
      image: '🍗',
      ingredients: ['Chicken Breast', 'Bell Peppers', 'Onions', 'Garlic', 'Rice'],
      time: '20 min',
      difficulty: 'Medium'
    },
    {
      id: 3,
      name: 'Black Bean Bowl',
      image: '🥣',
      ingredients: ['Black Beans', 'Rice', 'Avocado', 'Lime', 'Tomatoes'],
      time: '15 min',
      difficulty: 'Easy'
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPantryImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanPantry = async () => {
    if (!pantryImage) return;
    
    setIsScanning(true);
    
    // Simulate AI scanning process
    setTimeout(() => {
      const randomIngredients = mockIngredients
        .sort(() => 0.5 - Math.random())
        .slice(0, 6 + Math.floor(Math.random() * 4));
      
      setDetectedIngredients(randomIngredients);
      setSuggestedRecipes(mockRecipes);
      setScanResults({
        ingredientsFound: randomIngredients.length,
        recipesAvailable: mockRecipes.length,
        confidence: 85 + Math.floor(Math.random() * 15)
      });
      setIsScanning(false);
    }, 3000);
  };

  const clearScan = () => {
    setPantryImage(null);
    setDetectedIngredients([]);
    setSuggestedRecipes([]);
    setScanResults(null);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
            Smart Pantry
          </h2>
          <p className={`text-gray-600 mt-1 ${isMobile ? 'text-base' : 'text-sm'}`}>
            Scan your pantry to discover recipes you can make
          </p>
        </div>
        {scanResults && (
          <button
            onClick={clearScan}
            className={`px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors ${isMobile ? 'px-6 py-3 rounded-xl' : ''}`}
          >
            New Scan
          </button>
        )}
      </div>

      {/* Camera/Upload Section */}
      {!pantryImage && (
        <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center ${isMobile ? 'rounded-2xl p-10' : ''}`}>
          <div className="text-6xl mb-4">📷</div>
          <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${isMobile ? 'text-2xl' : ''}`}>
            Scan Your Pantry
          </h3>
          <p className={`text-gray-600 mb-6 ${isMobile ? 'text-base' : 'text-sm'}`}>
            Take a photo of your pantry, fridge, or ingredients and we'll suggest recipes you can make
          </p>
          
          <label className={`inline-flex items-center px-6 py-3 text-white rounded-lg font-medium cursor-pointer transition-colors ${isMobile ? 'px-8 py-4 rounded-xl' : ''}`}
                 style={{backgroundColor: '#F79101'}}>
            <span className="mr-2">📸</span>
            <span>Take Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              capture="environment"
            />
          </label>
          
          <div className={`mt-4 ${isMobile ? 'mt-6' : ''}`}>
            <p className={`text-gray-500 ${isMobile ? 'text-base' : 'text-sm'}`}>or</p>
            <label className={`mt-2 inline-flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-50 transition-colors ${isMobile ? 'px-6 py-3 rounded-xl mt-4' : ''}`}>
              <span className="mr-2">📁</span>
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Image Preview & Scan */}
      {pantryImage && !scanResults && (
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
          <div className="text-center">
            <img 
              src={pantryImage} 
              alt="Pantry" 
              className="max-w-full h-64 object-cover rounded-lg mx-auto mb-4"
            />
            
            {!isScanning ? (
              <button
                onClick={handleScanPantry}
                className={`px-6 py-3 text-white rounded-lg font-medium transition-colors ${isMobile ? 'px-8 py-4 rounded-xl' : ''}`}
                style={{backgroundColor: '#F79101'}}
              >
                <span className="mr-2">🔍</span>
                Scan Ingredients
              </button>
            ) : (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                <p className={`text-gray-600 ${isMobile ? 'text-base' : 'text-sm'}`}>
                  Analyzing your pantry with AI...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResults && (
        <div className={`bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">✨</span>
            <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-xl' : 'text-lg'}`}>
              Scan Complete!
            </h3>
          </div>
          
          <div className={`${isMobile ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-3 gap-6'} mb-6`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scanResults.ingredientsFound}</div>
              <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Ingredients Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{scanResults.recipesAvailable}</div>
              <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Recipes Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{scanResults.confidence}%</div>
              <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Detected Ingredients */}
      {detectedIngredients.length > 0 && (
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
          <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>
            🥕 Detected Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {detectedIngredients.map((ingredient, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${isMobile ? 'px-4 py-2' : ''}`}
                style={{backgroundColor: '#FFF2C7', color: '#8B5A00'}}
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Suggestions */}
      {suggestedRecipes.length > 0 && (
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
          <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>
            👨‍🍳 Recipes You Can Make
          </h3>
          <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {suggestedRecipes.map((recipe) => (
              <div key={recipe.id} 
                   className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${isMobile ? 'rounded-xl' : ''}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{recipe.image}</span>
                  <div className="flex-1">
                    <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{recipe.name}</h4>
                    <div className={`flex items-center space-x-3 mt-1 text-xs text-gray-500 ${isMobile ? 'text-sm space-x-4' : ''}`}>
                      <span>⏱️ {recipe.time}</span>
                      <span>📊 {recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className={`text-xs text-gray-600 font-medium mb-2 ${isMobile ? 'text-sm' : ''}`}>Uses your ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`}
                        style={{backgroundColor: '#E8F5E8', color: '#166534'}}
                      >
                        {ingredient}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className={`px-2 py-1 rounded-full text-xs text-gray-500 ${isMobile ? 'px-3' : ''}`}>
                        +{recipe.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  className={`w-full px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
                  style={{backgroundColor: '#F79101'}}
                >
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Tips */}
      {!pantryImage && (
        <div className={`bg-blue-50 rounded-xl p-6 border border-blue-200 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
          <h3 className={`font-semibold text-blue-900 mb-4 ${isMobile ? 'text-lg' : ''}`}>
            💡 Tips for Better Results
          </h3>
          <ul className={`space-y-2 text-blue-800 ${isMobile ? 'text-base space-y-3' : 'text-sm'}`}>
            <li>• Take a clear, well-lit photo of your pantry shelves or fridge</li>
            <li>• Make sure ingredient labels are visible</li>
            <li>• Include spices, condiments, and fresh produce</li>
            <li>• Try different angles for better ingredient detection</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PantryPage;