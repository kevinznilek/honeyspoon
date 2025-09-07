import React, { useState } from 'react';

const CommunityPage = ({ user, isMobile }) => {
  const [activeTab, setActiveTab] = useState('featured');

  const featuredRecipes = [];

  const trendingRecipes = [];

  const chefs = [];

  const RecipeCard = ({ recipe, featured = false }) => (
    <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-orange-200 ${
      featured ? 'bg-gradient-to-br from-orange-50 to-yellow-50' : 'bg-white'
    } ${isMobile ? 'rounded-xl p-5' : ''}`}>
      {featured && (
        <div className={`flex items-center space-x-2 mb-3 ${isMobile ? 'mb-4' : ''}`}>
          <span className="text-xs">⭐</span>
          <span className={`text-xs font-medium ${isMobile ? 'text-sm' : ''}`} 
                style={{color: '#F79101'}}>
            Featured Recipe
          </span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{recipe.image}</span>
          <div>
            <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{recipe.name}</h4>
            <div className={`flex items-center space-x-3 mt-1 text-xs text-gray-500 ${isMobile ? 'text-sm space-x-4' : ''}`}>
              <span>⏱️ {recipe.time}</span>
              <span>📊 {recipe.difficulty}</span>
            </div>
            <p className={`text-xs mt-1 ${isMobile ? 'text-sm' : ''}`} 
               style={{color: '#F79101'}}>
              {recipe.instagramHandle} • by {recipe.author}
            </p>
          </div>
        </div>
      </div>

      {recipe.description && (
        <p className={`text-xs text-gray-600 mb-3 ${isMobile ? 'text-sm' : ''}`}>
          {recipe.description}
        </p>
      )}

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

      <div className={`flex items-center justify-between ${isMobile ? 'flex-col space-y-3' : ''}`}>
        <div className={`flex items-center space-x-4 text-xs text-gray-500 ${isMobile ? 'text-sm space-x-6' : ''}`}>
          <span>❤️ {recipe.likes.toLocaleString()}</span>
          <span>📌 {recipe.saves.toLocaleString()}</span>
        </div>
        
        <div className={`flex space-x-2 ${isMobile ? 'w-full' : ''}`}>
          <button 
            className={`${isMobile ? 'flex-1' : ''} px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
            style={{backgroundColor: '#868a9d'}}
          >
            Save
          </button>
          <button 
            className={`${isMobile ? 'flex-1' : ''} px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
            style={{backgroundColor: '#F79101'}}
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );

  const ChefCard = ({ chef }) => (
    <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white ${isMobile ? 'rounded-xl p-5' : ''}`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{chef.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{chef.name}</h4>
            {chef.verified && <span className="text-blue-500 text-xs">✓</span>}
          </div>
          <p className={`text-xs text-gray-500 ${isMobile ? 'text-sm' : ''}`}>{chef.handle}</p>
          <p className={`text-xs ${isMobile ? 'text-sm' : ''}`} 
             style={{color: '#F79101'}}>
            {chef.specialty}
          </p>
        </div>
      </div>
      
      <div className={`grid grid-cols-2 gap-4 mt-4 text-center ${isMobile ? 'gap-6' : ''}`}>
        <div>
          <div className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{chef.followers}</div>
          <div className={`text-xs text-gray-500 ${isMobile ? 'text-sm' : ''}`}>Followers</div>
        </div>
        <div>
          <div className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>{chef.recipes}</div>
          <div className={`text-xs text-gray-500 ${isMobile ? 'text-sm' : ''}`}>Recipes</div>
        </div>
      </div>
      
      <button 
        className={`w-full mt-4 px-4 py-2 text-white rounded-lg font-medium transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
        style={{backgroundColor: '#F79101'}}
      >
        Follow
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
          Community
        </h2>
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${isMobile ? 'px-3' : ''}`} 
             style={{backgroundColor: '#868a9d', color: '#FFFFFF'}}>
          {featuredRecipes.length + trendingRecipes.length} recipes shared
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex space-x-2 overflow-x-auto pb-2 ${isMobile ? 'space-x-3 -mx-4 px-4' : ''}`}
           style={isMobile ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}>
        {[
          { id: 'featured', label: 'Featured', emoji: '⭐' },
          { id: 'trending', label: 'Trending', emoji: '🔥' },
          { id: 'chefs', label: 'Top Chefs', emoji: '👨‍🍳' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium text-sm flex items-center space-x-2 ${
              isMobile ? 'py-3 rounded-xl min-w-[120px] touch-manipulation' : ''
            } ${
              activeTab === tab.id 
                ? 'text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            style={activeTab === tab.id ? {backgroundColor: '#F79101'} : {}}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Recipes */}
      {activeTab === 'featured' && (
        <div className="space-y-4">
          <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
            <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>⭐ Featured This Week</h3>
            <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} featured={true} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending Recipes */}
      {activeTab === 'trending' && (
        <div className="space-y-4">
          <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
            <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>🔥 Trending Now</h3>
            <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              {trendingRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Chefs */}
      {activeTab === 'chefs' && (
        <div className="space-y-4">
          <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
            <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>👨‍🍳 Top Community Chefs</h3>
            <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              {chefs.map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Stats */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
        <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? 'text-lg' : ''}`}>Community Stats</h3>
        <div className={`${isMobile ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-4 gap-6'}`}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#F79101'}}>0</div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Recipes Shared</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#10B981'}}>0</div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Active Chefs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#6366F1'}}>0</div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Recipe Saves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: '#EC4899'}}>0</div>
            <div className={`text-sm text-gray-600 ${isMobile ? 'text-xs' : ''}`}>Total Likes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;