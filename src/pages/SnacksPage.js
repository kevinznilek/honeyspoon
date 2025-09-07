import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const SnacksPage = ({ user, isMobile }) => {
  const [favoriteSnacks, setFavoriteSnacks] = useState([]);
  const [showSnackCreator, setShowSnackCreator] = useState(false);

  const addNewSnack = (newSnack) => {
    const newId = Math.max(...favoriteSnacks.map(snack => snack.id), 0) + 1;
    const snack = {
      id: newId,
      name: newSnack.name,
      emoji: newSnack.emoji || '🍽️',
      category: newSnack.category,
      favorite: newSnack.favorite || null,
      store: newSnack.store
    };
    setFavoriteSnacks(prev => [...prev, snack]);
  };

  const SnackCreatorModal = () => {
    if (!showSnackCreator) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newSnack = {
        name: formData.get('name'),
        emoji: formData.get('emoji'),
        category: formData.get('category'),
        favorite: formData.get('favorite') === 'none' ? null : formData.get('favorite'),
        store: formData.get('store')
      };
      addNewSnack(newSnack);
      setShowSnackCreator(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Add New Snack</h3>
            <button 
              onClick={() => setShowSnackCreator(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
              <input
                type="text"
                name="emoji"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="🍪"
                maxLength={2}
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
                onClick={() => setShowSnackCreator(false)}
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