import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingCart, Camera, Video, Cookie, Users, Plus, CheckCircle, Clock, ChefHat, ArrowLeft, Menu, Share2, Heart, User, Edit, Upload, BookOpen, Download, TrendingUp, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import { useUserData } from './hooks/useUserData';

const MealPlanningApp = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('planner');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isMobile, setIsMobile] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFamilyProfiles, setShowFamilyProfiles] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [librarySortBy, setLibrarySortBy] = useState('imports');
  const [libraryExpanded, setLibraryExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState('all');
  const [selectedTagFilters, setSelectedTagFilters] = useState([]);
  const [selectedInstagramFilter, setSelectedInstagramFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showMealPicker, setShowMealPicker] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showRecipeCreator, setShowRecipeCreator] = useState(false);
  const [parseMode, setParseMode] = useState(false);
  const [parsedRecipe, setParsedRecipe] = useState(null);
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [contentFilter, setContentFilter] = useState('all');
  const [contentType, setContentType] = useState('blog');
  const [showSnackCreator, setShowSnackCreator] = useState(false);
  const [contentList, setContentList] = useState([
    { 
      id: 1,
      type: 'blog',
      title: "5 Meal Planning Mistakes That Cost You Time & Money", 
      excerpt: "Avoid these common pitfalls that busy families make when planning their weekly meals...",
      readTime: "5 min read",
      date: "Jan 25, 2025",
      tags: ["meal planning", "budgeting"]
    },
    { 
      id: 2,
      type: 'blog',
      title: "How to Get Picky Eaters to Try New Foods", 
      excerpt: "Evidence-based strategies that actually work for expanding your child's palate...",
      readTime: "8 min read",
      date: "Jan 22, 2025",
      tags: ["kids", "nutrition"]
    },
    { 
      id: 3,
      type: 'video',
      title: "Quick 15-Minute Dinners", 
      duration: "12:34", 
      views: "2.1k",
      date: "Jan 20, 2025",
      tags: ["quick meals", "weeknight"]
    },
    { 
      id: 4,
      type: 'blog',
      title: "The Science Behind Batch Cooking Success", 
      excerpt: "Why some families thrive with meal prep while others struggle, plus the psychology...",
      readTime: "6 min read",
      date: "Jan 18, 2025",
      tags: ["meal prep", "productivity"]
    },
    { 
      id: 5,
      type: 'video',
      title: "Meal Prep for Busy Families", 
      duration: "18:45", 
      views: "5.7k",
      date: "Jan 15, 2025",
      tags: ["meal prep", "family"]
    },
    { 
      id: 6,
      type: 'video',
      title: "Picky Eater Solutions", 
      duration: "9:22", 
      views: "3.2k",
      date: "Jan 12, 2025",
      tags: ["kids", "nutrition"]
    }
  ]);
  // Use database data instead of hardcoded state
  const {
    recipes: sampleRecipes,
    shoppingList,
    families,
    mealPlans: mealPlan,
    profile,
    loading: dataLoading,
    addRecipe,
    addShoppingItem,
    updateShoppingItem,
    setRecipes: setSampleRecipes,
    setShoppingList,
    setMealPlans: setMealPlan
  } = useUserData(user);

  // Check if screen is mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Authentication state management
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Get family members from database
  const familyMembers = families.length > 0 && families[0].family_members 
    ? families[0].family_members.map(member => ({
        name: member.name,
        restrictions: member.dietary_restrictions || []
      }))
    : [
        { name: "Mom", restrictions: ["dairy-free"] },
        { name: "Dad", restrictions: [] },
        { name: "Child 1", restrictions: ["no spicy"] },
        { name: "Child 2", restrictions: ["nut allergy"] }
      ];

  const [favoriteSnacks, setFavoriteSnacks] = useState([
    { id: 1, name: "Homemade Trail Mix", emoji: "🥜", category: "Nuts & Seeds", favorite: "Ezra Fave", store: "Costco" },
    { id: 2, name: "Apple Slices & Almond Butter", emoji: "🍎", category: "Fresh & Natural", favorite: "Mom Fave", store: "Sprouts" },
    { id: 3, name: "Energy Bites", emoji: "⚡", category: "Homemade", favorite: "Miles Fave", store: "Frazier Farms" },
    { id: 4, name: "Greek Yogurt Parfait", emoji: "🥛", category: "Protein Rich", favorite: "Dad Fave", store: "Trader Joes" },
    { id: 5, name: "Veggie Chips", emoji: "🥬", category: "Crunchy", favorite: null, store: "Costco" },
    { id: 6, name: "Cheese Cubes & Grapes", emoji: "🧀", category: "Fresh & Natural", favorite: null, store: "Frazier Farms" },
    { id: 7, name: "Smoothie Popsicles", emoji: "🍧", category: "Frozen Treats", favorite: "Ezra Fave", store: "Trader Joes" },
    { id: 8, name: "Whole Grain Crackers", emoji: "🍘", category: "Crunchy", favorite: null, store: "Sprouts" }
  ]);

  // Shared Recipe Library Data
  const sharedRecipes = [
    { 
      id: 101, 
      name: "Mediterranean Chickpea Bowl", 
      time: "15 min", 
      difficulty: "Easy", 
      tags: ["healthy", "vegetarian", "quick"],
      image: "🥗",
      originalFamily: "The Johnson Family",
      importCount: 247,
      dateShared: "2024-01-15"
    },
    { 
      id: 102, 
      name: "Korean Bulgogi Bowls", 
      time: "45 min", 
      difficulty: "Medium", 
      tags: ["asian fusion", "family dinner"],
      image: "🍜",
      originalFamily: "The Kim Family",
      importCount: 189,
      dateShared: "2024-01-10"
    },
    { 
      id: 103, 
      name: "One-Pan Honey Garlic Chicken", 
      time: "30 min", 
      difficulty: "Easy", 
      tags: ["one-pan", "kid-approved", "weeknight dinner"],
      image: "🍗",
      originalFamily: "The Martinez Family",
      importCount: 156,
      dateShared: "2024-01-18"
    },
    { 
      id: 104, 
      name: "Banana Oat Pancakes", 
      time: "10 min", 
      difficulty: "Easy", 
      tags: ["breakfast", "healthy", "gluten-free"],
      image: "🥞",
      originalFamily: "The Brown Family",
      importCount: 134,
      dateShared: "2024-01-20"
    },
    { 
      id: 105, 
      name: "Slow Cooker Beef Stew", 
      time: "4 hours", 
      difficulty: "Easy", 
      tags: ["comfort food", "slow cooker", "winter meals"],
      image: "🍲",
      originalFamily: "The Wilson Family",
      importCount: 98,
      dateShared: "2024-01-12"
    }
  ];

  const addMealToPlan = (recipe, day, mealType) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: recipe
      }
    }));
    setShowPlanModal(false);
    setShowMealPicker(null);
  };

  const openPlanModal = (recipe) => {
    setSelectedRecipe(recipe);
    setShowPlanModal(true);
  };

  const importRecipe = (libraryRecipe) => {
    // Remove family-specific info and add to personal recipes
    const cleanRecipe = {
      ...libraryRecipe,
      id: Date.now(), // Generate new ID
      tags: libraryRecipe.tags.filter(tag => !tag.includes('Fave')) // Remove family favorites
    };
    // In a real app, this would update the sampleRecipes array
    alert(`"${libraryRecipe.name}" imported to your recipes!`);
  };

  const getSortedLibraryRecipes = () => {
    const sorted = [...sharedRecipes];
    if (librarySortBy === 'imports') {
      return sorted.sort((a, b) => b.importCount - a.importCount);
    } else if (librarySortBy === 'recent') {
      return sorted.sort((a, b) => new Date(b.dateShared) - new Date(a.dateShared));
    } else if (librarySortBy === 'name') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  };

  const getFilteredRecipes = () => {
    let filtered = [...sampleRecipes];

    // Filter by family member favorites
    if (selectedFamilyFilter !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.tags.some(tag => tag.includes(selectedFamilyFilter + ' Fave'))
      );
    }

    // Filter by selected tags
    if (selectedTagFilters.length > 0) {
      filtered = filtered.filter(recipe =>
        selectedTagFilters.every(selectedTag =>
          recipe.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()) && !tag.includes('Fave'))
        )
      );
    }

    // Filter by Instagram source
    if (selectedInstagramFilter === 'instagram') {
      filtered = filtered.filter(recipe => recipe.instagramUrl || recipe.instagramHandle);
    } else if (selectedInstagramFilter === 'manual') {
      filtered = filtered.filter(recipe => !recipe.instagramUrl && !recipe.instagramHandle);
    } else if (selectedInstagramFilter !== 'all' && selectedInstagramFilter.startsWith('@')) {
      // Filter by specific Instagram handle
      filtered = filtered.filter(recipe => recipe.instagramHandle === selectedInstagramFilter);
    }

    return filtered;
  };

  const getPaginatedRecipes = () => {
    const filteredRecipes = getFilteredRecipes();
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    return filteredRecipes.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredRecipes().length / recipesPerPage);

  // Get all unique non-favorite tags for filter options
  const getAllTags = () => {
    const allTags = sampleRecipes.flatMap(recipe => recipe.tags);
    const uniqueTags = [...new Set(allTags.filter(tag => !tag.includes('Fave')))];
    return uniqueTags.sort();
  };

  // Get all unique Instagram handles for filter options
  const getAllInstagramHandles = () => {
    const handles = sampleRecipes
      .filter(recipe => recipe.instagramHandle)
      .map(recipe => recipe.instagramHandle);
    return [...new Set(handles)].sort();
  };

  const toggleTagFilter = (tag) => {
    setSelectedTagFilters(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearAllFilters = () => {
    setSelectedFamilyFilter('all');
    setSelectedTagFilters([]);
    setSelectedInstagramFilter('all');
    setCurrentPage(1);
  };

  const toggleShoppingItem = (itemId) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };


  const removeShoppingItem = (itemId) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
  };

  const addNewRecipe = async (newRecipe) => {
    try {
      await addRecipe(newRecipe);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const addNewContent = (newContent) => {
    const newId = Math.max(...contentList.map(content => content.id), 0) + 1;
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const content = {
      id: newId,
      type: newContent.type,
      title: newContent.title,
      tags: newContent.tags || [],
      date: currentDate,
      ...(newContent.type === 'blog' ? {
        excerpt: newContent.excerpt,
        readTime: newContent.readTime || 'TBD'
      } : {
        duration: newContent.duration || 'TBD',
        views: '0'
      })
    };
    
    setContentList(prev => [content, ...prev]);
  };

  const getFilteredContent = () => {
    if (contentFilter === 'all') return contentList;
    return contentList.filter(content => content.type === contentFilter);
  };

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

  const parseRecipeText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract recipe name (usually first line, remove emojis)
    const name = lines[0] ? lines[0].replace(/[^\w\s-]/g, '').trim() : '';
    
    // Extract time (look for patterns like "30 min", "1 hour", etc.)
    const timeMatch = text.match(/(\d+)\s*(min|minute|hour|hr)s?/i);
    const time = timeMatch ? `${timeMatch[1]} ${timeMatch[2]}` : '';
    
    // Extract difficulty
    let difficulty = 'Easy';
    if (/\b(hard|difficult|advanced|complex)\b/i.test(text)) difficulty = 'Hard';
    else if (/\b(medium|moderate)\b/i.test(text)) difficulty = 'Medium';
    
    // Extract ingredients (lines starting with -, •, or numbers)
    const ingredients = lines.filter(line => 
      /^[-•*]\s/.test(line) || /^\d+\.?\s/.test(line)
    ).map(line => line.replace(/^[-•*\d\.]\s*/, ''));
    
    // Extract hashtags and convert to tags
    const hashtags = (text.match(/#\w+/g) || [])
      .map(tag => tag.slice(1).toLowerCase())
      .filter(tag => tag.length > 2);
    
    // Extract emoji for recipe image
    const emojiMatch = text.match(/[🍕🌮🍝🍔🍖🥗🍲🥙🌯🍜🍛🥘🍳🥞🧀🍞🥖🍝🍤🐟🐠🦐🦀🦞]/);
    const image = emojiMatch ? emojiMatch[0] : '🍽️';
    
    // Extract Instagram handle (look for @username patterns)
    const handleMatch = text.match(/@[\w.]+/);
    const instagramHandle = handleMatch ? handleMatch[0] : null;

    return {
      name: name.substring(0, 50), // Limit length
      time: time,
      difficulty: difficulty,
      tags: hashtags.slice(0, 5), // Limit to 5 tags
      image: image,
      ingredients: ingredients.slice(0, 10), // Limit to 10 ingredients for preview
      instagramHandle: instagramHandle
    };
  };

  const tabs = [
    { id: 'planner', label: 'Meal Planner', icon: Calendar },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
    { id: 'snacks', label: 'Favorite Snacks', icon: Cookie },
    { id: 'pantry', label: 'Smart Pantry', icon: Camera },
    { id: 'content', label: 'Content', icon: Video }
  ];

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'shadow-sm' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
      style={isActive ? {backgroundColor: '#FCF4E8', color: '#F79101'} : {}}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const MealCard = ({ mealType, meal }) => (
    <div 
      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow ${isMobile ? 'min-h-[140px] rounded-2xl p-4 active:scale-95 transition-all' : ''} touch-manipulation`}
      onClick={() => setShowMealPicker({day: selectedDay, mealType: mealType})}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className={`font-semibold text-gray-800 capitalize ${isMobile ? 'text-lg' : ''}`}>{mealType}</h4>
        <Plus size={isMobile ? 24 : 16} className={`text-gray-400 ${isMobile ? 'p-1' : ''}`} style={isMobile ? {minWidth: '44px', minHeight: '44px'} : {}} />
      </div>
      {meal ? (
        <div className={`space-y-2 ${isMobile ? 'space-y-3' : ''}`}>
          <div className={`${isMobile ? 'text-3xl' : 'text-2xl'}`}>{meal.image}</div>
          <h5 className={`font-medium text-gray-700 ${isMobile ? 'text-sm leading-tight' : ''}`}>{meal.name}</h5>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            {meal.time}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          <ChefHat size={isMobile ? 28 : 24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">{isMobile ? 'Tap to add meal' : 'Add a meal'}</p>
        </div>
      )}
    </div>
  );

  const RecipeCard = ({ recipe }) => (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow ${isMobile ? 'rounded-2xl p-5 active:scale-95 transition-transform' : ''} touch-manipulation`}>
      <div className={`${isMobile ? 'text-4xl mb-4' : 'text-3xl mb-3'} text-center`}>{recipe.image}</div>
      <h4 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-lg leading-tight mb-3' : ''}`}>{recipe.name}</h4>
      <div className={`flex items-center text-sm text-gray-500 mb-3 ${isMobile ? 'mb-4' : ''}`}>
        <Clock size={isMobile ? 16 : 14} className={`mr-1 ${isMobile ? 'mr-2' : ''}`} />
        {recipe.time} • {recipe.difficulty}
      </div>
      <div className={`flex flex-wrap gap-1 mb-3 ${isMobile ? 'gap-2 mb-4' : ''}`}>
        {recipe.tags.map((tag, index) => {
          const isFavorite = tag.includes('Fave');
          const baseColors = { bg: index % 2 === 0 ? '#FFF2C7' : '#F59E02', text: index % 2 === 0 ? '#8B5A00' : '#FFFFFF' };
          const favoriteColors = { bg: '#FEF7ED', text: '#C2410C' };
          const colors = isFavorite ? favoriteColors : baseColors;
          
          return (
            <span key={index} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: colors.bg, color: colors.text}}>
              {isFavorite && <Heart size={12} fill="currentColor" />}
              {tag}
            </span>
          );
        })}
        {(recipe.instagramUrl || recipe.instagramHandle) && (
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: '#50C878', color: 'white'}}>
            📱
            {recipe.instagramHandle && <span>{recipe.instagramHandle}</span>}
          </span>
        )}
      </div>
      <button 
        onClick={() => openPlanModal(recipe)}
        className={`w-full py-3 rounded-xl text-sm font-medium transition-colors text-white touch-manipulation ${isMobile ? '' : 'py-2 rounded-lg'}`}
        style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
      >
        Plan Meal
      </button>
    </div>
  );

  // Show loading screen while checking authentication or loading data
  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 mx-auto">
            🍯
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">HoneySpoon</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className={`bg-white shadow-sm border-b border-gray-100 ${isMobile ? 'sticky top-0 z-40' : ''}`}>
        <div className={`${isMobile ? 'px-4' : 'max-w-6xl mx-auto px-4'} py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl">
                🍯
              </div>
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>HoneySpoon</h1>
                <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>Meal Planning and Sharing for Families</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowFamilyProfiles(true)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${isMobile ? '' : ''}`} 
                style={{backgroundColor: '#FCF4E8', color: '#B8860B'}}
              >
                <Users size={16} />
                <span className="text-sm font-medium">{isMobile ? '4' : 'Family of 4'}</span>
              </button>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity text-gray-600 hover:text-gray-800"
              >
                <User size={16} />
                {!isMobile && <span className="text-sm font-medium">Sign Out</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map(tab => (
                <TabButton 
                  key={tab.id}
                  id={tab.id} 
                  label={tab.label} 
                  icon={tab.icon} 
                  isActive={activeTab === tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                />
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`${isMobile ? 'px-4 py-6' : 'max-w-6xl mx-auto px-4 py-8'}`}>
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>{isMobile ? 'This Week' : "This Week's Meal Plan"}</h2>
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${isMobile ? 'px-3' : ''}`} style={{backgroundColor: '#868a9d', color: '#FFFFFF'}}>
                {isMobile ? 'Jan 29' : 'Week of Jan 29, 2025'}
              </div>
            </div>
            
            {/* Day Selector */}
            <div className={`flex space-x-2 overflow-x-auto pb-2 ${isMobile ? 'space-x-3 -mx-4 px-4' : ''}`} style={isMobile ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}>
              {Object.keys(mealPlan).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium text-sm ${isMobile ? 'py-3 rounded-xl min-w-[80px] touch-manipulation' : ''} ${
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
              <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'grid md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
                {familyMembers.map((member, index) => (
                  <div key={index} className={`rounded-lg p-3 ${isMobile ? 'rounded-xl p-4' : ''}`} style={{backgroundColor: '#FCF4E8'}}>
                    <h4 className={`font-medium ${isMobile ? 'text-base mb-2' : ''}`} style={{color: '#B8860B'}}>{member.name}</h4>
                    {member.restrictions.length > 0 ? (
                      <div className={`mt-2 space-y-1 ${isMobile ? 'space-y-2' : ''}`}>
                        {member.restrictions.map((restriction, idx) => (
                          <span key={idx} className={`inline-block px-2 py-1 rounded text-xs ${isMobile ? 'px-3 rounded-lg font-medium' : ''}`} style={{backgroundColor: '#FFF2C7', color: '#8B5A00'}}>
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
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="space-y-8">
            {/* My Recipes Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>My Recipes</h2>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''} ${showFilters ? 'bg-purple-100 text-purple-700' : ''}`} 
                    style={showFilters ? {} : {backgroundColor: '#F3F4F6', color: '#6B7280'}}
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    {(selectedFamilyFilter !== 'all' || selectedTagFilters.length > 0 || selectedInstagramFilter !== 'all') && (
                      <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {(selectedFamilyFilter !== 'all' ? 1 : 0) + selectedTagFilters.length + (selectedInstagramFilter !== 'all' ? 1 : 0)}
                      </span>
                    )}
                  </button>
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} style={{backgroundColor: '#868a9d', color: '#FFFFFF', ...(isMobile ? {minHeight: '44px'} : {})}}>
                    <Share2 size={16} />
                    <span>Share to Library</span>
                  </button>
                  <button 
                    onClick={() => setShowRecipeCreator(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} 
                    style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
                  >
                    {isMobile ? '+ Add' : '+ Add Recipe'}
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Filter Recipes</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear All
                      </button>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Family Favorites Filter */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Family Favorites</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {setSelectedFamilyFilter('all'); setCurrentPage(1);}}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedFamilyFilter === 'all' 
                              ? 'text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          style={selectedFamilyFilter === 'all' ? {backgroundColor: '#F79101'} : {}}
                        >
                          All Recipes
                        </button>
                        {familyMembers.map((member, index) => {
                          const memberName = member.name.split(' ')[0];
                          return (
                            <button
                              key={index}
                              onClick={() => {setSelectedFamilyFilter(memberName); setCurrentPage(1);}}
                              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedFamilyFilter === memberName 
                                  ? 'text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              style={selectedFamilyFilter === memberName ? {backgroundColor: '#F79101'} : {}}
                            >
                              <Heart size={12} fill="currentColor" />
                              <span>{memberName} Faves</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tags Filter */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {getAllTags().map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => toggleTagFilter(tag)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedTagFilters.includes(tag)
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            style={selectedTagFilters.includes(tag) ? {backgroundColor: index % 2 === 0 ? '#FFF2C7' : '#F59E02', color: index % 2 === 0 ? '#8B5A00' : '#FFFFFF'} : {}}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Instagram Source Filter */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Source</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {setSelectedInstagramFilter('all'); setCurrentPage(1);}}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedInstagramFilter === 'all' 
                              ? 'text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          style={selectedInstagramFilter === 'all' ? {backgroundColor: '#F79101'} : {}}
                        >
                          All Sources
                        </button>
                        <button
                          onClick={() => {setSelectedInstagramFilter('instagram'); setCurrentPage(1);}}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedInstagramFilter === 'instagram' 
                              ? 'text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          style={selectedInstagramFilter === 'instagram' ? {backgroundColor: '#50C878', color: 'white'} : {}}
                        >
                          📱
                          <span>Instagram</span>
                        </button>
                        <button
                          onClick={() => {setSelectedInstagramFilter('manual'); setCurrentPage(1);}}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedInstagramFilter === 'manual' 
                              ? 'text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          style={selectedInstagramFilter === 'manual' ? {backgroundColor: '#F79101'} : {}}
                        >
                          ✏️
                          <span>Manual</span>
                        </button>
                        {getAllInstagramHandles().map((handle, index) => (
                          <button
                            key={index}
                            onClick={() => {setSelectedInstagramFilter(handle); setCurrentPage(1);}}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedInstagramFilter === handle 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            style={selectedInstagramFilter === handle ? {backgroundColor: '#50C878', color: 'white'} : {}}
                          >
                            <span>{handle}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(selectedFamilyFilter !== 'all' || selectedTagFilters.length > 0 || selectedInstagramFilter !== 'all') && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Showing {getFilteredRecipes().length} of {sampleRecipes.length} recipes
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {selectedFamilyFilter !== 'all' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                                <Heart size={10} fill="currentColor" />
                                {selectedFamilyFilter} Faves
                                <button onClick={() => {setSelectedFamilyFilter('all'); setCurrentPage(1);}} className="hover:text-purple-900">
                                  <X size={10} />
                                </button>
                              </span>
                            )}
                            {selectedInstagramFilter !== 'all' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                                📱
                                {selectedInstagramFilter === 'instagram' ? 'Instagram' : 
                                 selectedInstagramFilter === 'manual' ? 'Manual' : 
                                 selectedInstagramFilter}
                                <button onClick={() => {setSelectedInstagramFilter('all'); setCurrentPage(1);}} className="hover:text-green-900">
                                  <X size={10} />
                                </button>
                              </span>
                            )}
                            {selectedTagFilters.map((tag, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                                {tag}
                                <button onClick={() => toggleTagFilter(tag)} className="hover:text-gray-900">
                                  <X size={10} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                {getPaginatedRecipes().map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentPage === page 
                            ? 'text-white' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        style={currentPage === page ? {backgroundColor: '#F79101'} : {}}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Recipe Library Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen size={24} className="text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">Community Recipe Library</h3>
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                      {sharedRecipes.length} recipes
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {libraryExpanded && (
                      <select 
                        value={librarySortBy}
                        onChange={(e) => setLibrarySortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="imports">Most Imported</option>
                        <option value="recent">Recently Added</option>
                        <option value="name">A-Z</option>
                      </select>
                    )}
                    
                    <button 
                      onClick={() => setLibraryExpanded(!libraryExpanded)}
                      className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                    >
                      {libraryExpanded ? (
                        <>
                          <ChevronUp size={16} />
                          <span>Minimize</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          <span>Expand</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {libraryExpanded ? (
                  <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                    {getSortedLibraryRecipes().map(recipe => (
                      <div key={recipe.id} className={`bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors ${isMobile ? 'rounded-2xl p-5' : ''}`}>
                        <div className={`${isMobile ? 'text-4xl mb-4' : 'text-3xl mb-3'} text-center`}>{recipe.image}</div>
                        <h4 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-lg leading-tight mb-3' : ''}`}>{recipe.name}</h4>
                        <div className={`flex items-center text-sm text-gray-500 mb-3 ${isMobile ? 'mb-4' : ''}`}>
                          <Clock size={isMobile ? 16 : 14} className={`mr-1 ${isMobile ? 'mr-2' : ''}`} />
                          {recipe.time} • {recipe.difficulty}
                        </div>
                        
                        <div className={`flex flex-wrap gap-1 mb-3 ${isMobile ? 'gap-2 mb-4' : ''}`}>
                          {recipe.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className={`px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: index % 2 === 0 ? '#FFF2C7' : '#F59E02', color: index % 2 === 0 ? '#8B5A00' : '#FFFFFF'}}>
                              {tag}
                            </span>
                          ))}
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: '#FEF3C7', color: '#92400E'}}>
                            <TrendingUp size={12} />
                            {recipe.importCount}
                          </span>
                        </div>
                        
                        <div className="mb-3 text-xs text-gray-500">
                          by {recipe.originalFamily}
                        </div>
                        
                        <button 
                          onClick={() => importRecipe(recipe)}
                          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`}
                          style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
                        >
                          <Download size={14} className="inline mr-2" />
                          Import
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getSortedLibraryRecipes().slice(0, 4).map(recipe => (
                      <div key={recipe.id} className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setLibraryExpanded(true)}>
                        <div className="text-2xl mb-2">{recipe.image}</div>
                        <h5 className="font-medium text-gray-800 text-sm mb-1">{recipe.name}</h5>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                          <TrendingUp size={10} />
                          {recipe.importCount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>{isMobile ? 'Shopping' : 'Shopping List'}</h2>
              <div className="flex space-x-3">
                <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} style={{backgroundColor: '#868a9d', color: '#FFFFFF', ...(isMobile ? {minHeight: '44px'} : {})}}>
                  <Share2 size={16} />
                  <span>{isMobile ? 'Share' : 'Share'}</span>
                </button>
                <button 
                  onClick={() => setShowAddItem(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} 
                  style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
                >
                  {isMobile ? '+ Add' : '+ Add Item'}
                </button>
              </div>
            </div>
            
            <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl p-5' : ''}`}>
              <div className="space-y-4">
                {shoppingList.map((item) => (
                  <div key={item.id} className={`flex items-center space-x-3 py-2 ${isMobile ? 'space-x-4 py-3 touch-manipulation' : ''}`}>
                    <CheckCircle 
                      size={isMobile ? 24 : 20} 
                      className={`cursor-pointer ${isMobile ? 'flex-shrink-0' : ''} ${item.checked ? '' : 'text-gray-300'}`}
                      style={item.checked ? {color: '#F79101'} : {}}
                      onClick={() => toggleShoppingItem(item.id)}
                    />
                    {isMobile ? (
                      <div className="flex-1 min-w-0">
                        <span className={`block text-base ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.item}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.category}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className={`flex-1 ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.item}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </>
                    )}
                    {item.checked && (
                      <button 
                        onClick={() => removeShoppingItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pantry' && (
          <div className="space-y-6">
            <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>Smart Pantry</h2>
            
            <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center ${isMobile ? 'rounded-2xl' : ''}`}>
              <Camera size={isMobile ? 64 : 48} className={`mx-auto mb-4 text-gray-400 ${isMobile ? 'mb-6' : ''}`} />
              <h3 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-xl mb-3' : 'text-xl'}`}>Snap Your Pantry</h3>
              <p className={`text-gray-600 mb-6 ${isMobile ? 'mb-8 leading-relaxed' : ''}`}>Take a photo of your fridge or pantry, and we'll suggest meals you can make right now!</p>
              <button className={`px-6 py-3 rounded-lg font-medium transition-colors text-white ${isMobile ? 'w-full py-4 rounded-xl touch-manipulation' : ''}`} style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '50px'} : {})}}>
                Open Camera
              </button>
            </div>
          </div>
        )}

        {activeTab === 'snacks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>Favorite Snacks</h2>
              <button 
                onClick={() => setShowSnackCreator(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} 
                style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
              >
                {isMobile ? '+ Add' : '+ Add Snack'}
              </button>
            </div>
            
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
          </div>
        )}

        {activeTab === 'bread' && (
          <div className="space-y-6">
            <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>Bread Studio</h2>
            
            <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 gap-6'}`}>
              <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl' : ''}`}>
                <div className={`${isMobile ? 'text-4xl mb-4' : 'text-3xl mb-3'}`}>🍞</div>
                <h3 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-xl mb-3' : 'text-xl'}`}>Fresh Sourdough</h3>
                <p className={`text-gray-600 mb-4 ${isMobile ? 'mb-6' : ''}`}>Weekly fresh-baked sourdough delivery to your door</p>
                <button className={`py-3 rounded-lg font-medium transition-colors ${isMobile ? 'w-full py-4 rounded-xl touch-manipulation' : 'w-full'}`} style={{backgroundColor: '#868a9d', color: '#F79101', ...(isMobile ? {minHeight: '50px'} : {})}}>
                  Schedule Delivery
                </button>
              </div>
              
              <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${isMobile ? 'rounded-2xl' : ''}`}>
                <div className={`${isMobile ? 'text-4xl mb-4' : 'text-3xl mb-3'}`}>🥖</div>
                <h3 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-xl mb-3' : 'text-xl'}`}>Bread Making Guide</h3>
                <p className={`text-gray-600 mb-4 ${isMobile ? 'mb-6' : ''}`}>Step-by-step video tutorials for homemade bread</p>
                <button className={`py-3 rounded-lg font-medium transition-colors text-white ${isMobile ? 'w-full py-4 rounded-xl touch-manipulation' : 'w-full'}`} style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '50px'} : {})}}>
                  Watch Tutorials
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>Content</h2>
              <button 
                onClick={() => setShowContentCreator(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${isMobile ? 'py-3 rounded-xl touch-manipulation' : ''}`} 
                style={{backgroundColor: '#F79101', ...(isMobile ? {minHeight: '44px'} : {})}}
              >
                {isMobile ? '+ Create' : '+ Create Content'}
              </button>
            </div>

            {/* Content Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setContentFilter('all')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  contentFilter === 'all' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
                style={contentFilter === 'all' ? {backgroundColor: '#F79101'} : {}}
              >
                All Content
              </button>
              <button 
                onClick={() => setContentFilter('blog')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  contentFilter === 'blog' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
                style={contentFilter === 'blog' ? {backgroundColor: '#F79101'} : {}}
              >
                📝 Blog Posts
              </button>
              <button 
                onClick={() => setContentFilter('video')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  contentFilter === 'video' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
                style={contentFilter === 'video' ? {backgroundColor: '#F79101'} : {}}
              >
                🎥 Videos
              </button>
            </div>
            
            {/* Content Grid */}
            <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {getFilteredContent().map((content, index) => (
                <div key={index} className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer ${isMobile ? 'rounded-2xl active:scale-95 transition-transform touch-manipulation' : 'hover:shadow-md transition-shadow'}`}>
                  {content.type === 'video' ? (
                    <div className="h-40 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #FCF4E8, #FFF2C7)'}}>
                      <Video size={isMobile ? 40 : 32} className="text-gray-400" />
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #FEF7ED, #FED7AA)'}}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">📝</div>
                        <div className="text-sm text-gray-600 font-medium">Blog Post</div>
                      </div>
                    </div>
                  )}
                  
                  <div className={`p-4 ${isMobile ? 'p-5' : ''}`}>
                    <h4 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-lg mb-3' : ''}`}>{content.title}</h4>
                    
                    {content.type === 'blog' && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.excerpt}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {content.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{content.date}</span>
                      <span>
                        {content.type === 'video' 
                          ? `${content.duration} • ${content.views} views`
                          : content.readTime
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
          <div className="grid grid-cols-3 gap-1">
            {tabs.slice(0, 3).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-colors touch-manipulation ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-600'
                }`}
                style={activeTab === tab.id ? {backgroundColor: '#F79101'} : {}}
              >
                <tab.icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{tab.id === 'planner' ? 'Meal Plan' : tab.id === 'recipes' ? 'Recipes' : 'Shopping'}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1 mt-1">
            {tabs.slice(3, 6).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-colors touch-manipulation ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-600'
                }`}
                style={activeTab === tab.id ? {backgroundColor: '#F79101'} : {}}
              >
                <tab.icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{tab.id === 'snacks' ? 'Snacks' : tab.id === 'pantry' ? 'Pantry' : 'Content'}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Plan Meal Modal */}
      {showPlanModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">{selectedRecipe.image}</div>
              <h3 className="text-xl font-bold text-gray-900">{selectedRecipe.name}</h3>
              <p className="text-sm text-gray-600">Choose when to plan this meal</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  {Object.keys(mealPlan).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal</label>
                <div className="grid grid-cols-3 gap-2">
                  {['breakfast', 'lunch', 'dinner'].map(meal => (
                    <button
                      key={meal}
                      onClick={() => {
                        const daySelect = document.querySelector('select');
                        addMealToPlan(selectedRecipe, daySelect.value, meal);
                      }}
                      className="py-3 px-4 rounded-xl text-sm font-medium transition-colors capitalize"
                      style={{backgroundColor: '#FCF4E8', color: '#B8860B'}}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowPlanModal(false)}
              className="w-full mt-6 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Family Profiles Modal */}
      {showFamilyProfiles && !selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Family Profiles</h3>
              <button 
                onClick={() => setShowFamilyProfiles(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {familyMembers.map((member, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedProfile(member)}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <User size={24} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-center mb-2">{member.name}</h4>
                  <div className="text-center">
                    {member.restrictions.length > 0 ? (
                      <div className="space-y-1">
                        {member.restrictions.map((restriction, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg">
                            {restriction}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No restrictions</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Individual Profile Modal */}
      {showFamilyProfiles && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h3 className="text-2xl font-bold text-gray-900">{selectedProfile.name}</h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedProfile(null);
                  setShowFamilyProfiles(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Profile Picture Section */}
            <div className="mb-8 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <User size={32} className="text-white" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                  <Upload size={14} className="text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Tap to upload photo</p>
            </div>

            {/* Favorite Meals Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart size={20} className="mr-2 text-red-500" />
                Favorite Meals
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {sampleRecipes
                  .filter(recipe => recipe.tags.some(tag => tag.includes(selectedProfile.name.split(' ')[0] + ' Fave')))
                  .map(recipe => (
                    <div key={recipe.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{recipe.image}</div>
                        <div>
                          <h5 className="font-medium text-gray-800">{recipe.name}</h5>
                          <p className="text-sm text-gray-600">{recipe.time} • {recipe.difficulty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                {sampleRecipes.filter(recipe => recipe.tags.some(tag => tag.includes(selectedProfile.name.split(' ')[0] + ' Fave'))).length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <Heart size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No favorite meals yet</p>
                    <p className="text-sm">Tag recipes with "{selectedProfile.name.split(' ')[0]} Fave" to see them here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dietary Restrictions Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Dietary Restrictions & Allergies</h4>
                <button className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                  <Plus size={16} className="inline mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {selectedProfile.restrictions.map((restriction, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2">
                    <span className="text-red-700 font-medium">{restriction}</span>
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                      <Edit size={14} />
                    </button>
                  </div>
                ))}
                {selectedProfile.restrictions.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No dietary restrictions</p>
                    <p className="text-sm">Add any allergies or dietary preferences</p>
                  </div>
                )}
              </div>
            </div>

            {/* Meal Preferences Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Meal Preferences</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <h5 className="font-medium text-green-800 mb-2">Likes</h5>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg mr-1">Spicy food</span>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg mr-1">Pasta</span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <h5 className="font-medium text-red-800 mb-2">Dislikes</h5>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg mr-1">Mushrooms</span>
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg mr-1">Fish</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cooking Involvement Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Cooking Involvement</h4>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-800">Cooking Skill Level</span>
                  <span className="text-blue-600 text-sm">Beginner</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
                </div>
                <div className="mt-3 text-sm text-blue-700">
                  <p>• Can help with simple tasks</p>
                  <p>• Learning to use kitchen tools safely</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meal Picker Modal */}
      {showMealPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Choose {showMealPicker.mealType} for {showMealPicker.day}
              </h3>
              <button 
                onClick={() => setShowMealPicker(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 gap-4'}`}>
              {sampleRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className={`bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors ${isMobile ? 'rounded-2xl p-5' : ''}`}
                  onClick={() => addMealToPlan(recipe, showMealPicker.day, showMealPicker.mealType)}
                >
                  <div className={`${isMobile ? 'text-3xl mb-3' : 'text-2xl mb-2'} text-center`}>{recipe.image}</div>
                  <h4 className={`font-semibold text-gray-800 mb-2 ${isMobile ? 'text-lg mb-3' : ''}`}>{recipe.name}</h4>
                  <div className={`flex items-center text-sm text-gray-500 mb-3 ${isMobile ? 'mb-4' : ''}`}>
                    <Clock size={isMobile ? 16 : 14} className={`mr-1 ${isMobile ? 'mr-2' : ''}`} />
                    {recipe.time} • {recipe.difficulty}
                  </div>
                  <div className={`flex flex-wrap gap-1 ${isMobile ? 'gap-2' : ''}`}>
                    {recipe.tags.map((tag, index) => {
                      const isFavorite = tag.includes('Fave');
                      const baseColors = { bg: index % 2 === 0 ? '#FFF2C7' : '#F59E02', text: index % 2 === 0 ? '#8B5A00' : '#FFFFFF' };
                      const favoriteColors = { bg: '#FEF7ED', text: '#C2410C' };
                      const colors = isFavorite ? favoriteColors : baseColors;
                      
                      return (
                        <span key={index} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isMobile ? 'px-3 font-medium' : ''}`} style={{backgroundColor: colors.bg, color: colors.text}}>
                          {isFavorite && <Heart size={12} fill="currentColor" />}
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Shopping Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Shopping Item</h3>
              <button 
                onClick={() => setShowAddItem(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newItem = {
                item: formData.get('item'),
                category: formData.get('category')
              };
              if (newItem.item.trim()) {
                addShoppingItem(newItem);
                setShowAddItem(false);
                e.target.reset();
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    name="item"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter item name..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    name="category"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white"
                  style={{backgroundColor: '#F79101'}}
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Creator Modal */}
      {showRecipeCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Recipe</h3>
              <button 
                onClick={() => {
                  setShowRecipeCreator(false);
                  setParseMode(false);
                  setParsedRecipe(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {!parseMode ? (
              <>
                {/* Mode Selection */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setParseMode(true)}
                      className="p-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
                    >
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-semibold text-purple-700">Parse from Instagram</div>
                      <div className="text-sm text-gray-600">Paste recipe text to auto-fill</div>
                    </button>
                    <button
                      onClick={() => setParseMode(false)}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors text-center"
                    >
                      <div className="text-2xl mb-2">✏️</div>
                      <div className="font-semibold text-gray-700">Manual Entry</div>
                      <div className="text-sm text-gray-600">Enter recipe details yourself</div>
                    </button>
                  </div>
                </div>

                {/* Manual Entry Form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const tags = formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [];
                  
                  const newRecipe = {
                    name: formData.get('name'),
                    time: formData.get('time'),
                    difficulty: formData.get('difficulty'),
                    image: formData.get('emoji') || '🍽️',
                    tags: tags,
                    instagramUrl: formData.get('instagramUrl') || null,
                    instagramHandle: formData.get('instagramHandle') || null
                  };
                  
                  if (newRecipe.name.trim()) {
                    addNewRecipe(newRecipe);
                    setShowRecipeCreator(false);
                    setParseMode(false);
                    setParsedRecipe(null);
                    e.target.reset();
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name *</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={parsedRecipe?.name || ''}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter recipe name..."
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time *</label>
                        <input
                          type="text"
                          name="time"
                          defaultValue={parsedRecipe?.time || ''}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g. 30 min"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
                        <select 
                          name="difficulty"
                          defaultValue={parsedRecipe?.difficulty || 'Easy'}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                      <input
                        type="text"
                        name="emoji"
                        defaultValue={parsedRecipe?.image || ''}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="🍽️"
                        maxLength="2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        defaultValue={parsedRecipe?.tags?.join(', ') || ''}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="healthy, quick, vegetarian (separate with commas)"
                      />
                      <p className="text-xs text-gray-500 mt-1">Add family favorites like "Mom Fave", "Miles Fave", etc.</p>
                    </div>

                    {/* Instagram Fields */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        📱 Instagram Source <span className="text-xs font-normal text-gray-500">(optional)</span>
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle</label>
                          <input
                            type="text"
                            name="instagramHandle"
                            defaultValue={parsedRecipe?.instagramHandle || ''}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="@username"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                          <input
                            type="url"
                            name="instagramUrl"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="https://instagram.com/p/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRecipeCreator(false);
                        setParseMode(false);
                        setParsedRecipe(null);
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
                      Create Recipe
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Parse Mode */
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">📱 Parse Instagram Recipe</h4>
                  <p className="text-sm text-blue-700">
                    Copy the text from an Instagram recipe post and paste it below. We'll automatically extract the recipe details for you!
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Text</label>
                  <textarea
                    id="recipe-text"
                    rows="8"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={`Paste your Instagram recipe here, for example:

Easy 30-minute chicken tacos! 🌮
- 1 lb chicken breast  
- 8 corn tortillas
- 1 bell pepper
- 2 tbsp olive oil
- 1 tsp cumin
Sauté chicken with cumin, add peppers, serve in tortillas!
#quickdinner #tacos #easy #familyfriendly`}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setParseMode(false);
                      setParsedRecipe(null);
                    }}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const text = document.getElementById('recipe-text').value;
                      if (text.trim()) {
                        const parsed = parseRecipeText(text);
                        setParsedRecipe(parsed);
                        setParseMode(false);
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white"
                    style={{backgroundColor: '#F79101'}}
                  >
                    Parse Recipe
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 border">
                  <p className="text-xs text-gray-600">
                    💡 <strong>Demo examples:</strong> Try pasting "Easy 20-min pasta! 🍝 - 1 cup pasta - 2 tomatoes Cook and enjoy! #quick #easy" to see the parsing in action.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Creator Modal */}
      {showContentCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Content</h3>
              <button 
                onClick={() => setShowContentCreator(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const tags = formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [];
              
              const newContent = {
                type: formData.get('contentType'),
                title: formData.get('title'),
                tags: tags,
                ...(formData.get('contentType') === 'blog' ? {
                  excerpt: formData.get('excerpt'),
                  readTime: formData.get('readTime')
                } : {
                  duration: formData.get('duration')
                })
              };
              
              if (newContent.title.trim()) {
                addNewContent(newContent);
                setShowContentCreator(false);
                e.target.reset();
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label 
                      className={`flex items-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 ${
                        contentType === 'blog' ? 'border-purple-500 bg-purple-50' : ''
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="contentType" 
                        value="blog" 
                        className="mr-3" 
                        checked={contentType === 'blog'}
                        onChange={(e) => setContentType(e.target.value)}
                      />
                      <div>
                        <div className="text-lg">📝</div>
                        <div className="font-medium">Blog Post</div>
                      </div>
                    </label>
                    <label 
                      className={`flex items-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 ${
                        contentType === 'video' ? 'border-purple-500 bg-purple-50' : ''
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="contentType" 
                        value="video" 
                        className="mr-3" 
                        checked={contentType === 'video'}
                        onChange={(e) => setContentType(e.target.value)}
                      />
                      <div>
                        <div className="text-lg">🎥</div>
                        <div className="font-medium">Video</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter content title..."
                    required
                  />
                </div>

                {/* Blog-specific fields */}
                {contentType === 'blog' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                      <textarea
                        name="excerpt"
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Brief description of your blog post..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                      <input
                        type="text"
                        name="readTime"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g. 5 min read"
                      />
                    </div>
                  </div>
                )}

                {/* Video-specific fields */}
                {contentType === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g. 12:34"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="meal planning, nutrition, kids (separate with commas)"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowContentCreator(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white"
                  style={{backgroundColor: '#F79101'}}
                >
                  Create Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snack Creator Modal */}
      {showSnackCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Snack</h3>
              <button 
                onClick={() => setShowSnackCreator(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              
              const newSnack = {
                name: formData.get('name'),
                emoji: formData.get('emoji'),
                category: formData.get('category'),
                favorite: formData.get('favorite') === 'none' ? null : formData.get('favorite'),
                store: formData.get('store')
              };
              
              if (newSnack.name.trim()) {
                addNewSnack(newSnack);
                setShowSnackCreator(false);
                e.target.reset();
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Snack Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter snack name..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                    <input
                      type="text"
                      name="emoji"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="🍎"
                      maxLength="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select 
                      name="category"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Fresh & Natural">Fresh & Natural</option>
                      <option value="Nuts & Seeds">Nuts & Seeds</option>
                      <option value="Homemade">Homemade</option>
                      <option value="Protein Rich">Protein Rich</option>
                      <option value="Crunchy">Crunchy</option>
                      <option value="Frozen Treats">Frozen Treats</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family Favorite</label>
                  <select 
                    name="favorite"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="none">No favorite</option>
                    <option value="Mom Fave">Mom Fave</option>
                    <option value="Dad Fave">Dad Fave</option>
                    <option value="Ezra Fave">Ezra Fave</option>
                    <option value="Miles Fave">Miles Fave</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store *</label>
                  <select 
                    name="store"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Where to buy</option>
                    <option value="Frazier Farms">Frazier Farms</option>
                    <option value="Sprouts">Sprouts</option>
                    <option value="Costco">Costco</option>
                    <option value="Trader Joes">Trader Joes</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
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
      )}
    </div>
  );
};

export default MealPlanningApp;