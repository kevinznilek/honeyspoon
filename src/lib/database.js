import { supabase } from './supabase';

// Recipe Functions
export const getRecipes = async (userId) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createRecipe = async (userId, recipe) => {
  const { data, error } = await supabase
    .from('recipes')
    .insert([{
      user_id: userId,
      name: recipe.name,
      time: recipe.time,
      difficulty: recipe.difficulty,
      tags: recipe.tags,
      image: recipe.image,
      instagram_url: recipe.instagramUrl,
      instagram_handle: recipe.instagramHandle,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || ''
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateRecipe = async (recipeId, updates) => {
  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', recipeId)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteRecipe = async (recipeId) => {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId);
  
  if (error) throw error;
};

// Family Functions
export const getFamilies = async (userId) => {
  const { data, error } = await supabase
    .from('families')
    .select(`
      *,
      family_members (*)
    `)
    .eq('created_by', userId);
  
  if (error) throw error;
  return data || [];
};

export const createFamily = async (userId, familyName) => {
  const { data, error } = await supabase
    .from('families')
    .insert([{
      created_by: userId,
      name: familyName
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const createFamilyMember = async (familyId, member) => {
  const { data, error } = await supabase
    .from('family_members')
    .insert([{
      family_id: familyId,
      name: member.name,
      dietary_restrictions: member.restrictions || []
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Shopping List Functions
export const getShoppingList = async (userId) => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createShoppingItem = async (userId, item) => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert([{
      user_id: userId,
      item_name: item.item || item.item_name,
      category: item.category,
      checked: item.checked || false,
      store: item.store,
      emoji: item.emoji
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateShoppingItem = async (itemId, updates) => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .update(updates)
    .eq('id', itemId)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteShoppingItem = async (itemId) => {
  const { error } = await supabase
    .from('shopping_lists')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
};

// Meal Plan Functions
export const getMealPlans = async (userId) => {
  const { data, error } = await supabase
    .from('meal_plans')
    .select(`
      *,
      recipes (*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
};

export const createMealPlan = async (userId, mealPlan) => {
  const { data, error } = await supabase
    .from('meal_plans')
    .insert([{
      user_id: userId,
      family_id: mealPlan.family_id,
      day_of_week: mealPlan.day_of_week,
      meal_type: mealPlan.meal_type,
      recipe_id: mealPlan.recipe_id,
      date: mealPlan.date
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateMealPlan = async (mealPlanId, updates) => {
  const { data, error } = await supabase
    .from('meal_plans')
    .update(updates)
    .eq('id', mealPlanId)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Profile Functions
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
};

export const createProfile = async (userId, profile) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      email: profile.email,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};