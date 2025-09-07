import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MealPlannerPage = ({ 
  mealPlan, 
  selectedDay, 
  setSelectedDay, 
  familyMembers, 
  isMobile, 
  setShowFamilyProfiles,
  recipes = []
}) => {
  const navigate = useNavigate();
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState(null);
  const [dailyNotes, setDailyNotes] = useState({});

  const openMealPlanner = (day, mealType) => {
    const isSnack = mealType === 'morning-snack' || mealType === 'afternoon-snack';
    
    if (isSnack && mockSnacks.length === 0) {
      navigate('/snacks');
      return;
    } else if (!isSnack && recipes.length === 0) {
      navigate('/recipes');
      return;
    }
    
    setSelectedMealSlot({ day, mealType });
    setShowMealModal(true);
  };
  const MealCard = ({ mealType, meal }) => (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold text-gray-800 capitalize ${isMobile ? 'text-lg' : ''}`}>{mealType}</h3>
        <span className={`text-xs text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
          {mealType === 'breakfast' ? '8:00 AM' : mealType === 'lunch' ? '12:30 PM' : '6:00 PM'}
        </span>
      </div>
      
      {meal ? (
        <div className={`border border-gray-200 rounded-lg p-3 ${isMobile ? 'rounded-xl p-4' : ''}`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{meal.image || '🍽️'}</span>
            <div className="flex-1">
              <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{meal.name}</h4>
              <div className={`flex items-center space-x-3 mt-1 text-xs text-gray-500 ${isMobile ? 'text-sm space-x-4' : ''}`}>
                <span>⏱️ {meal.time}</span>
                <span>📊 {meal.difficulty}</span>
              </div>
            </div>
          </div>
          
          {meal.tags && meal.tags.length > 0 && (
            <div className={`flex flex-wrap gap-2 mt-3 ${isMobile ? 'gap-2' : ''}`}>
              {meal.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`}
                  style={{backgroundColor: '#FFF2C7', color: '#8B5A00'}}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => openMealPlanner(selectedDay, mealType)}
          className={`w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50 transition-colors ${isMobile ? 'rounded-xl p-8' : ''}`}
        >
          <div className="text-gray-400 mb-2">
            <span className="text-2xl">+</span>
          </div>
          <p className={`text-gray-500 font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>Plan Meal</p>
        </button>
      )}
    </div>
  );

  // Mock snacks data - in a real app, this would come from the database
  const mockSnacks = [
    { id: 's1', name: 'Mixed Nuts', emoji: '🥜', category: 'Nuts & Seeds' },
    { id: 's2', name: 'Apple Slices', emoji: '🍎', category: 'Fresh & Natural' },
    { id: 's3', name: 'Granola Bar', emoji: '🥨', category: 'Crunchy' },
    { id: 's4', name: 'Yogurt', emoji: '🥩', category: 'Protein Rich' },
    { id: 's5', name: 'Cookies', emoji: '🍪', category: 'Sweet' }
  ];

  const MealPlanningModal = () => {
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    if (!showMealModal || !selectedMealSlot) return null;

    const isSnack = selectedMealSlot.mealType === 'morning-snack' || selectedMealSlot.mealType === 'afternoon-snack';
    const itemsList = isSnack ? mockSnacks : recipes;

    const handleSubmit = (e) => {
      e.preventDefault();
      // TODO: Implement meal planning logic here
      console.log('Planning meal:', { 
        day: selectedMealSlot.day, 
        mealType: selectedMealSlot.mealType, 
        recipe: selectedRecipe, 
        time: selectedTime 
      });
      setShowMealModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Plan {selectedMealSlot.mealType.replace('-', ' ')} for {selectedMealSlot.day}
            </h3>
            <button 
              onClick={() => setShowMealModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {isSnack ? 'Snack' : 'Recipe'}
              </label>
              <select
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                required
              >
                <option value="">Choose a {isSnack ? 'snack' : 'recipe'}...</option>
                {itemsList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.emoji || item.image} {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowMealModal(false)}
                className={`flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors ${isMobile ? 'py-4' : ''}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors ${isMobile ? 'py-4' : ''}`}
                style={{backgroundColor: '#F79101'}}
              >
                Plan {isSnack ? 'Snack' : 'Meal'}
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
          {isMobile ? 'This Week' : "This Week's Meal Plan"}
        </h2>
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${isMobile ? 'px-3' : ''}`} 
             style={{backgroundColor: '#868a9d', color: '#FFFFFF'}}>
          {isMobile ? 'Jan 29' : 'Week of Jan 29, 2025'}
        </div>
      </div>
      
      {/* Day Selector */}
      <div className={`flex space-x-2 overflow-x-auto pb-2 ${isMobile ? 'space-x-3 -mx-4 px-4' : ''}`} 
           style={isMobile ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}>
        {Object.keys(mealPlan).map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium text-sm ${
              isMobile ? 'py-3 rounded-xl min-w-[80px] touch-manipulation' : ''
            } ${
              selectedDay === day 
                ? 'text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            style={selectedDay === day ? {backgroundColor: '#F79101'} : {}}
          >
            {isMobile ? day.slice(0, 3) : day}
          </button>
        ))}
      </div>

      {/* Meals for Selected Day */}
      <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-3 gap-6'}`}>
        <MealCard mealType="breakfast" meal={mealPlan[selectedDay].breakfast} />
        <MealCard mealType="lunch" meal={mealPlan[selectedDay].lunch} />
        <MealCard mealType="dinner" meal={mealPlan[selectedDay].dinner} />
      </div>

      {/* Snacks Section */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
        <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>Snacks</h3>
        <div className={`${isMobile ? 'space-y-3' : 'grid md:grid-cols-2 gap-4'}`}>
          <button 
            onClick={() => openMealPlanner(selectedDay, 'morning-snack')}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 hover:bg-orange-50 transition-colors ${isMobile ? 'rounded-xl p-5' : ''}`}
          >
            <div className="text-gray-400 mb-2">
              <span className="text-lg">+</span>
            </div>
            <p className={`text-gray-500 font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>Morning Snack</p>
          </button>
          <button 
            onClick={() => openMealPlanner(selectedDay, 'afternoon-snack')}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 hover:bg-orange-50 transition-colors ${isMobile ? 'rounded-xl p-5' : ''}`}
          >
            <div className="text-gray-400 mb-2">
              <span className="text-lg">+</span>
            </div>
            <p className={`text-gray-500 font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>Afternoon Snack</p>
          </button>
        </div>
      </div>

      {/* Daily Notes */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
        <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>Notes for {selectedDay}</h3>
        <textarea
          value={dailyNotes[selectedDay] || ''}
          onChange={(e) => setDailyNotes(prev => ({ ...prev, [selectedDay]: e.target.value }))}
          placeholder="Add notes for today's meal planning, shopping reminders, or any other thoughts..."
          className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none ${isMobile ? 'p-5 rounded-xl text-base' : 'text-sm'}`}
          rows={isMobile ? 6 : 4}
        />
      </div>

      <MealPlanningModal />
    </div>
  );
};

export default MealPlannerPage;