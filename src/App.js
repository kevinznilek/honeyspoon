import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Calendar, ShoppingCart, Camera, Video, Cookie, Users, User } from 'lucide-react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import { useUserData } from './hooks/useUserData';

// Import page components
import MealPlannerPage from './pages/MealPlannerPage';
import RecipesPage from './pages/RecipesPage';
import ShoppingPage from './pages/ShoppingPage';
import PantryPage from './pages/PantryPage';
import CommunityPage from './pages/CommunityPage';

const Navigation = ({ user, isMobile, setShowFamilyProfiles }) => {
  const location = useLocation();
  
  const tabs = [
    { id: 'planner', label: 'Meal Planner', icon: Calendar, path: '/' },
    { id: 'recipes', label: 'Recipes', icon: Cookie, path: '/recipes' },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart, path: '/shopping' },
    { id: 'pantry', label: 'Smart Pantry', icon: Camera, path: '/pantry' },
    { id: 'community', label: 'Community', icon: Video, path: '/community' }
  ];

  const TabButton = ({ path, label, icon: Icon, isActive }) => (
    <Link
      to={path}
      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium text-sm flex items-center space-x-2 ${
        isMobile ? 'py-3 rounded-xl min-w-[80px] touch-manipulation justify-center' : ''
      } ${
        isActive 
          ? 'text-white shadow-sm' 
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
      }`}
      style={isActive ? {backgroundColor: '#F79101'} : {}}
    >
      <Icon size={isMobile ? 20 : 16} />
      {!isMobile && <span>{label}</span>}
      {isMobile && <span className="text-xs">{label.split(' ')[0]}</span>}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map(tab => (
                <TabButton 
                  key={tab.id}
                  path={tab.path}
                  label={tab.label} 
                  icon={tab.icon} 
                  isActive={location.pathname === tab.path} 
                />
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
          <div className="flex justify-around">
            {tabs.map(tab => (
              <TabButton 
                key={tab.id}
                path={tab.path}
                label={tab.label} 
                icon={tab.icon} 
                isActive={location.pathname === tab.path} 
              />
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isMobile, setIsMobile] = useState(false);
  const [showFamilyProfiles, setShowFamilyProfiles] = useState(false);

  // Use database data
  const {
    recipes,
    shoppingList,
    families,
    mealPlans: mealPlan,
    profile,
    loading: dataLoading,
    addRecipe,
    addShoppingItem,
    updateShoppingItem,
    setRecipes,
    setShoppingList,
    setMealPlans
  } = useUserData(user);

  // Check if mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check authentication
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAuthLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Family profiles modal (simplified for routing)
  const FamilyProfilesModal = () => {
    if (!showFamilyProfiles) return null;
    
    const familyMembers = families[0]?.family_members || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Family Profiles</h3>
            <button 
              onClick={() => setShowFamilyProfiles(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            {familyMembers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-gray-500 mb-4">No family members added yet</p>
                <p className="text-sm text-gray-400">Add family members to track dietary restrictions and preferences</p>
              </div>
            ) : (
              familyMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-500">
                      {member.dietary_restrictions?.length > 0 ? member.dietary_restrictions.join(', ') : 'No restrictions'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button
            onClick={() => setShowFamilyProfiles(false)}
            className={`w-full mt-6 py-3 px-4 text-white rounded-lg font-medium transition-colors ${isMobile ? 'py-4 rounded-xl' : ''}`}
            style={{backgroundColor: '#F79101'}}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍯</div>
          <p className="text-gray-600">Loading HoneySpoon...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const familyMembers = families[0]?.family_members || [];

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className={`bg-white shadow-sm border-b border-gray-100 ${isMobile ? 'sticky top-0 z-40' : ''}`}>
        <div className={`${isMobile ? 'px-4' : 'max-w-6xl mx-auto px-4'} py-4`}>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl">
                🍯
              </div>
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>HoneySpoon</h1>
                <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>Meal Planning and Sharing for Families</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowFamilyProfiles(true)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${isMobile ? '' : ''}`} 
                style={{backgroundColor: '#FCF4E8', color: '#B8860B'}}
              >
                <Users size={16} />
                <span className="text-sm font-medium">
                  {familyMembers.length === 0 
                    ? (isMobile ? 'Family' : 'My Family') 
                    : (isMobile ? familyMembers.length : `Family of ${familyMembers.length}`)
                  }
                </span>
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

      <Navigation user={user} isMobile={isMobile} setShowFamilyProfiles={setShowFamilyProfiles} />

      {/* Main Content */}
      <main className={`${isMobile ? 'px-4 py-6' : 'max-w-6xl mx-auto px-4 py-8'}`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <MealPlannerPage 
                mealPlan={mealPlan}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                familyMembers={familyMembers}
                isMobile={isMobile}
                setShowFamilyProfiles={setShowFamilyProfiles}
              />
            } 
          />
          <Route 
            path="/recipes" 
            element={
              <RecipesPage 
                recipes={recipes}
                setRecipes={setRecipes}
                addRecipe={addRecipe}
                user={user}
                isMobile={isMobile}
                setShowFamilyProfiles={setShowFamilyProfiles}
              />
            } 
          />
          <Route 
            path="/shopping" 
            element={
              <ShoppingPage 
                shoppingList={shoppingList}
                setShoppingList={setShoppingList}
                addShoppingItem={addShoppingItem}
                updateShoppingItem={updateShoppingItem}
                user={user}
                isMobile={isMobile}
              />
            } 
          />
          <Route 
            path="/pantry" 
            element={
              <PantryPage 
                user={user}
                isMobile={isMobile}
              />
            } 
          />
          <Route 
            path="/community" 
            element={
              <CommunityPage 
                user={user}
                isMobile={isMobile}
              />
            } 
          />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <FamilyProfilesModal />
    </div>
  );
};

const MealPlanningApp = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default MealPlanningApp;