import React, { useState } from 'react';

const RecipesPage = ({ 
  recipes, 
  setRecipes, 
  addRecipe, 
  user, 
  isMobile,
  setShowFamilyProfiles 
}) => {
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [selectedRecipeForPlan, setSelectedRecipeForPlan] = useState(null);

  const openMealPlanModal = (recipe) => {
    setSelectedRecipeForPlan(recipe);
    setShowMealPlanModal(true);
  };

  const RecipeModal = ({ recipe, onClose, onSave }) => {
    const [name, setName] = useState(recipe?.name || '');
    const [time, setTime] = useState(recipe?.time || '30 min');
    const [difficulty, setDifficulty] = useState(recipe?.difficulty || 'Easy');
    const [image, setImage] = useState(recipe?.image || '🍽️');
    const [tags, setTags] = useState(recipe?.tags ? recipe.tags.join(', ') : '');
    const [instagramUrl, setInstagramUrl] = useState(recipe?.instagramUrl || '');
    const [instagramHandle, setInstagramHandle] = useState(recipe?.instagramHandle || '');
    const [instructions, setInstructions] = useState(recipe?.instructions || '');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!name.trim()) return;

      const recipeData = {
        name: name.trim(),
        time,
        difficulty,
        image: image || '🍽️',
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        instagramUrl: instagramUrl.trim(),
        instagramHandle: instagramHandle.trim(),
        instructions: instructions.trim()
      };

      if (recipe) {
        const updatedRecipes = recipes.map(r => r.id === recipe.id ? {...r, ...recipeData} : r);
        setRecipes(updatedRecipes);
      } else {
        await addRecipe(recipeData);
      }
      
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {recipe ? 'Edit Recipe' : 'Add New Recipe'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="Enter recipe name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                >
                  <option>15 min</option>
                  <option>30 min</option>
                  <option>45 min</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2+ hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none ${isMobile ? 'text-base' : ''}`}
                placeholder="Enter recipe instructions..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="healthy, quick, vegetarian"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle</label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="@cookingwithkatie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
                placeholder="https://instagram.com/p/..."
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
                {recipe ? 'Update' : 'Add Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const MealPlanModal = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedMealType, setSelectedMealType] = useState('breakfast');

    if (!showMealPlanModal || !selectedRecipeForPlan) return null;

    const handlePlanMeal = () => {
      // TODO: Implement meal planning logic
      console.log('Planning meal:', {
        recipe: selectedRecipeForPlan,
        day: selectedDay,
        mealType: selectedMealType
      });
      setShowMealPlanModal(false);
      setSelectedRecipeForPlan(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Plan Meal</h3>
            <button 
              onClick={() => setShowMealPlanModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{selectedRecipeForPlan.image}</span>
              <div>
                <h4 className="font-medium text-gray-900">{selectedRecipeForPlan.name}</h4>
                <p className="text-sm text-gray-500">{selectedRecipeForPlan.time} • {selectedRecipeForPlan.difficulty}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Meal</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${isMobile ? 'text-base' : ''}`}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="morning-snack">Morning Snack</option>
                <option value="afternoon-snack">Afternoon Snack</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              onClick={() => setShowMealPlanModal(false)}
              className={`flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors ${isMobile ? 'py-4' : ''}`}
            >
              Cancel
            </button>
            <button
              onClick={handlePlanMeal}
              className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors ${isMobile ? 'py-4' : ''}`}
              style={{backgroundColor: '#F79101'}}
            >
              Add to Meal Plan
            </button>
          </div>
        </div>
      </div>
    );
  };

  const communityRecipes = [
    {
      id: 'c1',
      name: 'Honey Garlic Chicken',
      time: '45 min',
      difficulty: 'Medium',
      image: '🍯',
      tags: ['protein', 'sweet', 'dinner'],
      instagramHandle: '@honeykitchen',
      saves: 324
    },
    {
      id: 'c2',
      name: 'Mediterranean Bowl',
      time: '20 min',
      difficulty: 'Easy',
      image: '🥗',
      tags: ['healthy', 'vegetarian', 'fresh'],
      instagramHandle: '@medlife',
      saves: 156
    },
    {
      id: 'c3',
      name: 'Spicy Ramen',
      time: '30 min',
      difficulty: 'Medium',
      image: '🍜',
      tags: ['spicy', 'comfort', 'asian'],
      instagramHandle: '@ramenmaster',
      saves: 89
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
          Recipe Library
        </h2>
        <button
          onClick={() => setShowAddRecipe(true)}
          className={`px-4 py-2 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors ${isMobile ? 'px-6 py-3 rounded-xl' : ''}`}
          style={{backgroundColor: '#F79101'}}
        >
          <span className="text-lg">+</span>
          <span>{isMobile ? 'Add' : 'Add Recipe'}</span>
        </button>
      </div>

      {/* My Recipes Section */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-lg' : ''}`}>My Recipes</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isMobile ? 'px-4' : ''}`}
                style={{backgroundColor: '#FCF4E8', color: '#B8860B'}}>
            {recipes.length} recipes
          </span>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🍳</div>
            <p className="text-gray-500">No recipes yet. Add your first recipe!</p>
            <button
              onClick={() => setShowAddRecipe(true)}
              className={`mt-4 px-6 py-2 text-white rounded-lg font-medium ${isMobile ? 'px-8 py-3 rounded-xl' : ''}`}
              style={{backgroundColor: '#F79101'}}
            >
              Add Recipe
            </button>
          </div>
        ) : (
          <div className={`${isMobile ? 'space-y-3' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {recipes.map((recipe) => (
              <div key={recipe.id} 
                   className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${isMobile ? 'rounded-xl' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{recipe.image}</span>
                    <div>
                      <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{recipe.name}</h4>
                      <div className={`flex items-center space-x-3 mt-1 text-xs text-gray-500 ${isMobile ? 'text-sm space-x-4' : ''}`}>
                        <span>⏱️ {recipe.time}</span>
                        <span>📊 {recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className={`flex flex-wrap gap-2 mb-3 ${isMobile ? 'gap-2' : ''}`}>
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} 
                            className={`px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`}
                            style={{backgroundColor: '#FFF2C7', color: '#8B5A00'}}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`flex space-x-2 ${isMobile ? 'flex-col space-y-2 space-x-0' : ''}`}>
                  <button 
                    onClick={() => setShowAddRecipe(recipe)}
                    className={`flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
                    style={{backgroundColor: '#868a9d'}}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => openMealPlanModal(recipe)}
                    className={`flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
                    style={{backgroundColor: '#F79101'}}
                  >
                    Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Recipes Section */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-lg' : ''}`}>Community Recipes</h3>
          <button 
            onClick={() => setExpandedRecipe(expandedRecipe ? null : 'community')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isMobile ? 'px-4 py-2 rounded-xl' : ''}`}
            style={{backgroundColor: '#868a9d', color: '#FFFFFF'}}
          >
            {expandedRecipe ? 'Collapse' : `${communityRecipes.length} recipes`}
          </button>
        </div>

        {expandedRecipe === 'community' && (
          <div className={`${isMobile ? 'space-y-3' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {communityRecipes.map((recipe) => (
              <div key={recipe.id} 
                   className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${isMobile ? 'rounded-xl' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{recipe.image}</span>
                    <div>
                      <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{recipe.name}</h4>
                      <div className={`flex items-center space-x-3 mt-1 text-xs text-gray-500 ${isMobile ? 'text-sm space-x-4' : ''}`}>
                        <span>⏱️ {recipe.time}</span>
                        <span>📊 {recipe.difficulty}</span>
                      </div>
                      <p className={`text-xs ${isMobile ? 'text-sm' : ''}`} 
                         style={{color: '#F79101'}}>
                        {recipe.instagramHandle} • {recipe.saves} saves
                      </p>
                    </div>
                  </div>
                </div>

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className={`flex flex-wrap gap-2 mb-3 ${isMobile ? 'gap-2' : ''}`}>
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} 
                            className={`px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`}
                            style={{backgroundColor: '#FFF2C7', color: '#8B5A00'}}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`flex space-x-2 ${isMobile ? 'flex-col space-y-2 space-x-0' : ''}`}>
                  <button 
                    className={`flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
                    style={{backgroundColor: '#868a9d'}}
                  >
                    Import
                  </button>
                  <button 
                    onClick={() => openMealPlanModal(recipe)}
                    className={`flex-1 px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
                    style={{backgroundColor: '#F79101'}}
                  >
                    Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddRecipe && (
        <RecipeModal
          recipe={typeof showAddRecipe === 'object' ? showAddRecipe : null}
          onClose={() => setShowAddRecipe(false)}
          onSave={() => {}}
        />
      )}

      <MealPlanModal />
    </div>
  );
};

export default RecipesPage;