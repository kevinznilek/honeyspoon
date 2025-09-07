import { useState, useEffect } from 'react';
import {
  getRecipes,
  createRecipe,
  getShoppingList,
  createShoppingItem,
  updateShoppingItem,
  getFamilies,
  createFamily,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getMealPlans,
  getProfile,
  createProfile
} from '../lib/database';

export const useUserData = (user) => {
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [families, setFamilies] = useState([]);
  const [mealPlans, setMealPlans] = useState({});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default meal plan structure
  const defaultMealPlan = {
    Monday: { breakfast: null, lunch: null, dinner: null },
    Tuesday: { breakfast: null, lunch: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null }
  };

  // Load all user data when user changes
  useEffect(() => {
    if (!user) {
      setRecipes([]);
      setShoppingList([]);
      setFamilies([]);
      setMealPlans(defaultMealPlan);
      setProfile(null);
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Load all data in parallel
        const [
          userRecipes,
          userShoppingList,
          userFamilies,
          userMealPlans,
          userProfile
        ] = await Promise.all([
          getRecipes(user.id),
          getShoppingList(user.id),
          getFamilies(user.id),
          getMealPlans(user.id),
          getProfile(user.id)
        ]);

        // Set recipes
        setRecipes(userRecipes.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          time: recipe.time,
          difficulty: recipe.difficulty,
          tags: recipe.tags || [],
          image: recipe.image,
          instagramUrl: recipe.instagram_url,
          instagramHandle: recipe.instagram_handle,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || ''
        })));

        // Set shopping list
        setShoppingList(userShoppingList.map(item => ({
          id: item.id,
          item: item.item_name,
          category: item.category,
          checked: item.checked,
          store: item.store,
          emoji: item.emoji
        })));

        // Set families
        setFamilies(userFamilies);

        // Convert meal plans from array to object structure
        const mealPlanObj = { ...defaultMealPlan };
        userMealPlans.forEach(plan => {
          if (mealPlanObj[plan.day_of_week]) {
            mealPlanObj[plan.day_of_week][plan.meal_type] = plan.recipes;
          }
        });
        setMealPlans(mealPlanObj);

        // Set profile
        if (!userProfile) {
          // Create profile if it doesn't exist
          const newProfile = await createProfile(user.id, {
            email: user.email,
            full_name: user.user_metadata?.full_name || ''
          });
          setProfile(newProfile);
        } else {
          setProfile(userProfile);
        }

        // If new user with no data, create empty default family
        if (userFamilies.length === 0) {
          await createFamily(user.id, "My Family");
          
          // Reload families (empty family for now)
          const updatedFamilies = await getFamilies(user.id);
          setFamilies(updatedFamilies);
        }

        // Migrate localStorage data for existing users
        await migrateLocalStorageData(user.id);

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Function to migrate localStorage data to database
  const migrateLocalStorageData = async (userId) => {
    try {
      // Check if migration already done
      const migrationKey = `honeyspoon-migrated-${userId}`;
      if (localStorage.getItem(migrationKey)) return;

      // Migrate recipes
      const savedRecipes = localStorage.getItem('honeyspoon-recipes');
      if (savedRecipes) {
        const parsedRecipes = JSON.parse(savedRecipes);
        for (const recipe of parsedRecipes) {
          if (recipe.name) {
            await createRecipe(userId, recipe);
          }
        }
      }

      // Migrate shopping list
      const savedShopping = localStorage.getItem('honeyspoon-shopping');
      if (savedShopping) {
        const parsedShopping = JSON.parse(savedShopping);
        for (const item of parsedShopping) {
          if (item.item) {
            await createShoppingItem(userId, item);
          }
        }
      }

      // Mark migration as completed
      localStorage.setItem(migrationKey, 'true');
      console.log('Data migration completed for user:', userId);
      
    } catch (error) {
      console.error('Error during data migration:', error);
    }
  };

  // Helper functions to update data
  const addRecipe = async (recipe) => {
    try {
      const newRecipe = await createRecipe(user.id, recipe);
      setRecipes(prev => [...prev, {
        id: newRecipe.id,
        name: newRecipe.name,
        time: newRecipe.time,
        difficulty: newRecipe.difficulty,
        tags: newRecipe.tags || [],
        image: newRecipe.image,
        instagramUrl: newRecipe.instagram_url,
        instagramHandle: newRecipe.instagram_handle
      }]);
      return newRecipe;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  };

  const addShoppingItem = async (item) => {
    try {
      const newItem = await createShoppingItem(user.id, item);
      setShoppingList(prev => [...prev, {
        id: newItem.id,
        item: newItem.item_name,
        category: newItem.category,
        checked: newItem.checked,
        store: newItem.store,
        emoji: newItem.emoji
      }]);
      return newItem;
    } catch (error) {
      console.error('Error adding shopping item:', error);
      throw error;
    }
  };

  const updateShoppingItemLocal = async (itemId, updates) => {
    try {
      await updateShoppingItem(itemId, {
        item_name: updates.item,
        category: updates.category,
        checked: updates.checked,
        store: updates.store,
        emoji: updates.emoji
      });
      
      setShoppingList(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
  };

  const addFamilyMember = async (member) => {
    try {
      if (families.length === 0) return;
      
      const familyId = families[0].id;
      const newMember = await createFamilyMember(familyId, member);
      
      setFamilies(prev => prev.map(family => 
        family.id === familyId 
          ? { ...family, family_members: [...family.family_members, newMember] }
          : family
      ));
      
      return newMember;
    } catch (error) {
      console.error('Error adding family member:', error);
      throw error;
    }
  };

  const updateFamilyMemberLocal = async (memberId, updates) => {
    try {
      const updatedMember = await updateFamilyMember(memberId, updates);
      
      setFamilies(prev => prev.map(family => ({
        ...family,
        family_members: family.family_members.map(member =>
          member.id === memberId ? updatedMember : member
        )
      })));
      
      return updatedMember;
    } catch (error) {
      console.error('Error updating family member:', error);
      throw error;
    }
  };

  const removeFamilyMember = async (memberId) => {
    try {
      await deleteFamilyMember(memberId);
      
      setFamilies(prev => prev.map(family => ({
        ...family,
        family_members: family.family_members.filter(member => member.id !== memberId)
      })));
    } catch (error) {
      console.error('Error removing family member:', error);
      throw error;
    }
  };

  return {
    recipes,
    shoppingList,
    families,
    mealPlans,
    profile,
    loading,
    addRecipe,
    addShoppingItem,
    updateShoppingItem: updateShoppingItemLocal,
    addFamilyMember,
    updateFamilyMember: updateFamilyMemberLocal,
    removeFamilyMember,
    setRecipes,
    setShoppingList,
    setMealPlans
  };
};