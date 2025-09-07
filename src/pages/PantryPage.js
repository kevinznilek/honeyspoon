import React, { useState } from 'react';

const PantryPage = ({ user, isMobile }) => {
  const [pantryItems, setPantryItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const categories = [
    { name: 'Produce', emoji: '🥬', color: '#10B981' },
    { name: 'Meat & Seafood', emoji: '🥩', color: '#EF4444' },
    { name: 'Dairy', emoji: '🧀', color: '#3B82F6' },
    { name: 'Pantry', emoji: '🥫', color: '#F59E0B' },
    { name: 'Frozen', emoji: '❄️', color: '#6366F1' },
    { name: 'Beverages', emoji: '🥤', color: '#8B5CF6' },
    { name: 'Condiments', emoji: '🧂', color: '#EC4899' },
    { name: 'Other', emoji: '📦', color: '#6B7280' }
  ];

  const locations = ['Pantry Shelf 1', 'Pantry Shelf 2', 'Fridge Door', 'Fridge Main', 'Fridge Crisper', 'Freezer', 'Countertop', 'Other'];

  const AddItemModal = ({ item, onClose }) => {
    const [name, setName] = useState(item?.name || '');
    const [category, setCategory] = useState(item?.category || 'Other');
    const [quantity, setQuantity] = useState(item?.quantity || '');
    const [emoji, setEmoji] = useState(item?.emoji || '📦');
    const [expiry, setExpiry] = useState(item?.expiry || '');
    const [location, setLocation] = useState(item?.location || 'Pantry Shelf 1');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!name.trim()) return;

      const itemData = {
        id: item?.id || Date.now(),
        name: name.trim(),
        category,
        quantity,
        emoji: emoji || '📦',
        expiry,
        location
      };

      if (item) {
        setPantryItems(prev => prev.map(i => i.id === item.id ? itemData : i));
      } else {
        setPantryItems(prev => [...prev, itemData]);
      }
      
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {item ? 'Edit Item' : 'Add Pantry Item'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                  placeholder="1 jar, 2 lbs, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="📦"
                maxLength={2}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors ${isMobile ? 'py-4' : ''}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors ${isMobile ? 'py-4' : ''}`}
                style={{backgroundColor: '#F79101'}}
              >
                {item ? 'Update' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const groupedItems = categories.map(category => ({
    ...category,
    items: pantryItems.filter(item => item.category === category.name)
  })).filter(category => category.items.length > 0);

  const expiringItems = pantryItems.filter(item => {
    if (!item.expiry) return false;
    const expiryDate = new Date(item.expiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { text: 'Expired', color: '#EF4444' };
    if (daysUntilExpiry <= 3) return { text: `${daysUntilExpiry} days`, color: '#F59E0B' };
    if (daysUntilExpiry <= 7) return { text: `${daysUntilExpiry} days`, color: '#10B981' };
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
          Pantry Tracker
        </h2>
        <button
          onClick={() => setShowAddItem(true)}
          className={`px-4 py-2 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors ${isMobile ? 'px-6 py-3 rounded-xl' : ''}`}
          style={{backgroundColor: '#F79101'}}
        >
          <span className="text-lg">+</span>
          <span>{isMobile ? 'Add' : 'Add Item'}</span>
        </button>
      </div>

      {/* Expiring Soon Section */}
      {expiringItems.length > 0 && (
        <div className={`bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">⚠️</span>
            <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-lg' : ''}`}>
              Expiring Soon ({expiringItems.length} items)
            </h3>
          </div>
          <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-2 gap-3'}`}>
            {expiringItems.map(item => {
              const status = getExpiryStatus(item.expiry);
              return (
                <div key={item.id} className={`bg-white rounded-lg p-3 border border-orange-200 ${isMobile ? 'rounded-xl p-4' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{item.name}</p>
                      <p className={`text-xs ${isMobile ? 'text-sm' : ''}`} style={{color: status.color}}>
                        {status.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pantryItems.length === 0 ? (
        <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center ${isMobile ? 'rounded-2xl p-10' : ''}`}>
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-gray-500 mb-4">Your pantry is empty</p>
          <button
            onClick={() => setShowAddItem(true)}
            className={`px-6 py-2 text-white rounded-lg font-medium ${isMobile ? 'px-8 py-3 rounded-xl' : ''}`}
            style={{backgroundColor: '#F79101'}}
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedItems.map(category => (
            <div key={category.name} 
                 className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xl">{category.emoji}</span>
                <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-lg' : ''}`}>
                  {category.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isMobile ? 'px-3' : ''}`}
                      style={{backgroundColor: '#FCF4E8', color: '#B8860B'}}>
                  {category.items.length}
                </span>
              </div>

              <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-2 lg:grid-cols-3 gap-4'}`}>
                {category.items.map(item => {
                  const status = getExpiryStatus(item.expiry);
                  return (
                    <div key={item.id} 
                         className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${isMobile ? 'rounded-xl' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{item.name}</h4>
                            <div className={`mt-1 space-y-1 ${isMobile ? 'space-y-1' : ''}`}>
                              {item.quantity && (
                                <p className={`text-xs text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
                                  📦 {item.quantity}
                                </p>
                              )}
                              <p className={`text-xs text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
                                📍 {item.location}
                              </p>
                              {status && (
                                <p className={`text-xs font-medium ${isMobile ? 'text-sm' : ''}`} 
                                   style={{color: status.color}}>
                                  ⏰ {status.text}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingItem(item)}
                          className={`text-gray-400 hover:text-gray-600 p-1 ${isMobile ? 'p-2' : ''}`}
                        >
                          <span className={`${isMobile ? 'text-lg' : ''}`}>✏️</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
        <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>Pantry Stats</h3>
        <div className={`${isMobile ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-4 gap-6'}`}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#F79101'}}>{pantryItems.length}</div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#10B981'}}>{groupedItems.length}</div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#F59E0B'}}>{expiringItems.length}</div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Expiring Soon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#EF4444'}}>
              {pantryItems.filter(item => getExpiryStatus(item.expiry)?.color === '#EF4444').length}
            </div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Expired</div>
          </div>
        </div>
      </div>

      {(showAddItem || editingItem) && (
        <AddItemModal
          item={editingItem}
          onClose={() => {
            setShowAddItem(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default PantryPage;