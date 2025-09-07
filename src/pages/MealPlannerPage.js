import React from 'react';

const MealPlannerPage = ({ 
  mealPlan, 
  selectedDay, 
  setSelectedDay, 
  familyMembers, 
  isMobile, 
  setShowFamilyProfiles 
}) => {
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
        <button className={`w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50 transition-colors ${isMobile ? 'rounded-xl p-8' : ''}`}>
          <div className="text-gray-400 mb-2">
            <span className="text-2xl">+</span>
          </div>
          <p className={`text-gray-500 font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>Plan Meal</p>
        </button>
      )}
    </div>
  );

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

      {/* Family Dietary Restrictions */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
        <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>Family Dietary Needs</h3>
        {familyMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <p className="text-gray-500 mb-4">No family members added yet</p>
            <button
              onClick={() => setShowFamilyProfiles(true)}
              className={`px-6 py-2 text-white rounded-lg font-medium ${isMobile ? 'px-8 py-3 rounded-xl' : ''}`}
              style={{backgroundColor: '#F79101'}}
            >
              Add Family Members
            </button>
          </div>
        ) : (
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'grid md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
            {familyMembers.map((member, index) => (
              <div key={index} className={`rounded-lg p-3 ${isMobile ? 'rounded-xl p-4' : ''}`} 
                   style={{backgroundColor: '#FCF4E8'}}>
                <h4 className={`font-medium ${isMobile ? 'text-base mb-2' : ''}`} 
                    style={{color: '#B8860B'}}>{member.name}</h4>
                {member.dietary_restrictions?.length > 0 ? (
                  <div className={`mt-2 space-y-1 ${isMobile ? 'space-y-2' : ''}`}>
                    {member.dietary_restrictions.map((restriction, idx) => (
                      <span key={idx} className={`inline-block px-2 py-1 rounded text-xs ${isMobile ? 'px-3 rounded-lg font-medium' : ''}`} 
                            style={{backgroundColor: '#FFF2C7', color: '#8B5A00'}}>
                        {restriction}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm" style={{color: '#F79101'}}>No restrictions</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className={`flex items-center justify-between mt-6 ${isMobile ? 'flex-col space-y-3' : ''}`}>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isMobile ? 'py-3 rounded-xl touch-manipulation w-full justify-center' : ''}`} 
            style={{backgroundColor: '#868a9d', color: '#FFFFFF', ...(isMobile ? {minHeight: '44px'} : {})}}
          >
            <span>Suggest Meals</span>
          </button>
          <button 
            onClick={() => setShowFamilyProfiles(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation w-full' : ''}`} 
            style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
          >
            <span>{isMobile ? 'Manage Family' : 'Manage'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerPage;