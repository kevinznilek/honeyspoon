import React, { useState } from 'react';

const ShoppingPage = ({ 
  shoppingList, 
  setShoppingList, 
  addShoppingItem, 
  updateShoppingItem, 
  user, 
  isMobile 
}) => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const categories = [
    { name: 'Produce', emoji: '🥬', color: '#10B981' },
    { name: 'Meat & Seafood', emoji: '🥩', color: '#EF4444' },
    { name: 'Dairy', emoji: '🧀', color: '#3B82F6' },
    { name: 'Pantry', emoji: '🥫', color: '#F59E0B' },
    { name: 'Frozen', emoji: '❄️', color: '#6366F1' },
    { name: 'Bakery', emoji: '🍞', color: '#8B5CF6' },
    { name: 'Snacks', emoji: '🍿', color: '#EC4899' },
    { name: 'Other', emoji: '🛒', color: '#6B7280' }
  ];

  const stores = ['Grocery Store', 'Walmart', 'Target', 'Costco', 'Whole Foods', 'Other'];

  const AddItemModal = ({ item, onClose, onSave }) => {
    const [itemName, setItemName] = useState(item?.item || '');
    const [category, setCategory] = useState(item?.category || 'Other');
    const [store, setStore] = useState(item?.store || 'Grocery Store');
    const [emoji, setEmoji] = useState(item?.emoji || '🛒');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!itemName.trim()) return;

      const itemData = {
        item: itemName.trim(),
        category,
        store,
        emoji: emoji || '🛒',
        checked: item?.checked || false
      };

      if (item) {
        await updateShoppingItem(item.id, itemData);
      } else {
        await addShoppingItem(itemData);
      }
      
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {item ? 'Edit Item' : 'Add Shopping Item'}
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
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="Enter item name"
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
              >
                {stores.map(storeName => (
                  <option key={storeName} value={storeName}>{storeName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="🛒"
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
    items: shoppingList.filter(item => item.category === category.name)
  })).filter(category => category.items.length > 0);

  const toggleItemChecked = async (item) => {
    await updateShoppingItem(item.id, { ...item, checked: !item.checked });
  };

  const checkedCount = shoppingList.filter(item => item.checked).length;
  const totalCount = shoppingList.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
            Shopping List
          </h2>
          {totalCount > 0 && (
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-base' : 'text-sm'}`}>
              {checkedCount} of {totalCount} items completed
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddItem(true)}
          className={`px-4 py-2 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors ${isMobile ? 'px-6 py-3 rounded-xl' : ''}`}
          style={{backgroundColor: '#F79101'}}
        >
          <span className="text-lg">+</span>
          <span>{isMobile ? 'Add' : 'Add Item'}</span>
        </button>
      </div>

      {totalCount > 0 && (
        <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-medium text-gray-700 ${isMobile ? 'text-lg' : ''}`}>Progress</span>
            <span className={`text-sm font-medium ${isMobile ? 'text-base' : ''}`} 
                  style={{color: '#F79101'}}>
              {Math.round((checkedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: '#F79101',
                width: `${(checkedCount / totalCount) * 100}%`
              }}
            ></div>
          </div>
        </div>
      )}

      {shoppingList.length === 0 ? (
        <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center ${isMobile ? 'rounded-2xl p-10' : ''}`}>
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-gray-500 mb-4">Your shopping list is empty</p>
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

              <div className="space-y-2">
                {category.items.map(item => (
                  <div key={item.id} 
                       className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                         item.checked 
                           ? 'bg-gray-50 border-gray-200 opacity-60' 
                           : 'bg-white border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                       } ${isMobile ? 'p-4 rounded-xl' : ''}`}>
                    <button
                      onClick={() => toggleItemChecked(item)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        item.checked 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 hover:border-orange-400'
                      } ${isMobile ? 'w-6 h-6' : ''}`}
                    >
                      {item.checked && <span className="text-white text-xs">✓</span>}
                    </button>

                    <span className="text-xl flex-shrink-0">{item.emoji}</span>

                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-gray-900 ${item.checked ? 'line-through' : ''} ${isMobile ? 'text-base' : 'text-sm'}`}>
                        {item.item}
                      </p>
                      {item.store && (
                        <p className={`text-xs text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
                          {item.store}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setEditingItem(item)}
                      className={`text-gray-400 hover:text-gray-600 p-1 ${isMobile ? 'p-2' : ''}`}
                    >
                      <span className={`${isMobile ? 'text-lg' : ''}`}>✏️</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAddItem || editingItem) && (
        <AddItemModal
          item={editingItem}
          onClose={() => {
            setShowAddItem(false);
            setEditingItem(null);
          }}
          onSave={() => {}}
        />
      )}
    </div>
  );
};

export default ShoppingPage;