import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Calendar, ShoppingCart, Camera, Video, Cookie, Users, User, ChefHat } from 'lucide-react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import { useUserData } from './hooks/useUserData';

// Import page components
import MealPlannerPage from './pages/MealPlannerPage';
import RecipesPage from './pages/RecipesPage';
import ShoppingPage from './pages/ShoppingPage';
import SnacksPage from './pages/SnacksPage';
import PantryPage from './pages/PantryPage';
import ContentPage from './pages/ContentPage';

const Navigation = ({ user, isMobile, setShowFamilyProfiles }) => {
  const location = useLocation();
  
  const tabs = [
    { id: 'planner', label: 'Meal Planner', mobileLabel: 'Planning', icon: Calendar, path: '/' },
    { id: 'recipes', label: 'Recipes', mobileLabel: 'Recipes', icon: ChefHat, path: '/recipes' },
    { id: 'snacks', label: 'Favorite Snacks', mobileLabel: 'Snacks', icon: Cookie, path: '/snacks' },
    { id: 'shopping', label: 'Shopping List', mobileLabel: 'Shopping', icon: ShoppingCart, path: '/shopping' },
    { id: 'pantry', label: 'Smart Pantry', mobileLabel: 'Smart', icon: Camera, path: '/pantry' },
    { id: 'content', label: 'Content', mobileLabel: 'Content', icon: Video, path: '/content' }
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
          <div className="grid grid-cols-3 grid-rows-2 gap-1">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${
                  location.pathname === tab.path
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
                style={location.pathname === tab.path ? {backgroundColor: '#F79101'} : {}}
              >
                <tab.icon size={20} className="mb-1" />
                <span className="text-xs font-medium leading-tight text-center">{tab.mobileLabel}</span>
              </Link>
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
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
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

  // Enhanced Family profiles modal
  const FamilyProfilesModal = () => {
    const [editingMember, setEditingMember] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [memberName, setMemberName] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');

    if (!showFamilyProfiles) return null;
    
    const familyMembers = families[0]?.family_members || [];

    const handleAddMember = async (e) => {
      e.preventDefault();
      try {
        const restrictions = dietaryRestrictions
          .split(',')
          .map(r => r.trim())
          .filter(r => r);
        
        await addFamilyMember({
          name: memberName,
          restrictions: restrictions
        });
        
        setMemberName('');
        setDietaryRestrictions('');
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding family member:', error);
      }
    };

    const handleUpdateMember = async (memberId) => {
      try {
        const member = familyMembers.find(m => m.id === memberId);
        const restrictions = dietaryRestrictions
          .split(',')
          .map(r => r.trim())
          .filter(r => r);
        
        await updateFamilyMember(memberId, {
          name: memberName,
          restrictions: restrictions
        });
        
        setEditingMember(null);
        setMemberName('');
        setDietaryRestrictions('');
      } catch (error) {
        console.error('Error updating family member:', error);
      }
    };

    const startEdit = (member) => {
      setEditingMember(member.id);
      setMemberName(member.name);
      setDietaryRestrictions(member.dietary_restrictions?.join(', ') || '');
    };

    const handleDelete = async (memberId) => {
      if (window.confirm('Are you sure you want to remove this family member?')) {
        try {
          await removeFamilyMember(memberId);
        } catch (error) {
          console.error('Error removing family member:', error);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isMobile ? 'p-5' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Family Profiles</h3>
            <button 
              onClick={() => setShowFamilyProfiles(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3 mb-6">
            {familyMembers.map((member) => (
              <div key={member.id} className="p-3 rounded-lg border border-gray-200">
                {editingMember === member.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Member name"
                    />
                    <input
                      type="text"
                      value={dietaryRestrictions}
                      onChange={(e) => setDietaryRestrictions(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Dietary restrictions (comma separated)"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateMember(member.id)}
                        className="flex-1 py-2 px-3 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-500">
                          {member.dietary_restrictions?.length > 0 
                            ? member.dietary_restrictions.join(', ') 
                            : 'No restrictions'
                          }
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(member)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {familyMembers.length === 0 && !showAddForm && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-gray-500 mb-4">No family members added yet</p>
                <p className="text-sm text-gray-400">Add family members to track dietary restrictions and preferences</p>
              </div>
            )}
          </div>

          {showAddForm ? (
            <form onSubmit={handleAddMember} className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Member name"
                required
              />
              <input
                type="text"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Dietary restrictions (comma separated)"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className={`w-full mb-4 py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors ${isMobile ? 'py-3 rounded-xl' : ''}`}
            >
              + Add Family Member
            </button>
          )}
          
          <button
            onClick={() => setShowFamilyProfiles(false)}
            className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-colors ${isMobile ? 'py-4 rounded-xl' : ''}`}
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
                <span className="text-sm font-medium">Logout</span>
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
                recipes={recipes}
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
            path="/snacks" 
            element={
              <SnacksPage 
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
            path="/content" 
            element={
              <ContentPage 
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