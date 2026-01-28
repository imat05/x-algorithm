import { ApiKeyItem } from '../types';

const STORAGE_KEY = 'gemini_api_keys';

/**
 * Get all API keys from localStorage
 */
export const getAllApiKeys = (): ApiKeyItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading API keys:', error);
    return [];
  }
};

/**
 * Get the currently active API key
 */
export const getActiveApiKey = (): ApiKeyItem | null => {
  const keys = getAllApiKeys();
  return keys.find(k => k.isActive) || null;
};

/**
 * Save API keys to localStorage
 */
const saveApiKeys = (keys: ApiKeyItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error('Error saving API keys:', error);
    throw new Error('Failed to save API keys');
  }
};

/**
 * Add a new API key
 */
export const addApiKey = (name: string, key: string, setAsActive: boolean = true): ApiKeyItem => {
  const keys = getAllApiKeys();
  
  // Check if key already exists
  if (keys.some(k => k.key === key)) {
    throw new Error('This API key already exists');
  }

  // If setting as active, deactivate all others
  if (setAsActive) {
    keys.forEach(k => k.isActive = false);
  }

  const newKey: ApiKeyItem = {
    id: Date.now().toString(),
    name,
    key,
    isActive: setAsActive,
    createdAt: new Date().toISOString(),
  };

  keys.push(newKey);
  saveApiKeys(keys);
  
  return newKey;
};

/**
 * Update an existing API key
 */
export const updateApiKey = (id: string, updates: Partial<ApiKeyItem>): void => {
  const keys = getAllApiKeys();
  const index = keys.findIndex(k => k.id === id);
  
  if (index === -1) {
    throw new Error('API key not found');
  }

  // If setting this key as active, deactivate others
  if (updates.isActive === true) {
    keys.forEach(k => k.isActive = false);
  }

  keys[index] = { ...keys[index], ...updates };
  saveApiKeys(keys);
};

/**
 * Delete an API key
 */
export const deleteApiKey = (id: string): void => {
  let keys = getAllApiKeys();
  const keyToDelete = keys.find(k => k.id === id);
  
  if (!keyToDelete) {
    throw new Error('API key not found');
  }

  keys = keys.filter(k => k.id !== id);
  
  // If we deleted the active key, activate the first remaining one
  if (keyToDelete.isActive && keys.length > 0) {
    keys[0].isActive = true;
  }

  saveApiKeys(keys);
};

/**
 * Set a key as active
 */
export const setActiveApiKey = (id: string): void => {
  const keys = getAllApiKeys();
  
  keys.forEach(k => {
    k.isActive = k.id === id;
  });

  saveApiKeys(keys);
};

/**
 * Update last used timestamp for a key
 */
export const updateLastUsed = (id: string): void => {
  const keys = getAllApiKeys();
  const key = keys.find(k => k.id === id);
  
  if (key) {
    key.lastUsed = new Date().toISOString();
    saveApiKeys(keys);
  }
};

/**
 * Migrate old single API key to new format (for backward compatibility)
 */
export const migrateOldApiKey = (): boolean => {
  const oldKey = localStorage.getItem('gemini_api_key');
  
  if (oldKey && getAllApiKeys().length === 0) {
    addApiKey('Default Key', oldKey, true);
    localStorage.removeItem('gemini_api_key');
    return true;
  }
  
  return false;
};
