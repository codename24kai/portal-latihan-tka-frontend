const DB_NAME = 'PortalLatihanDB';
const STORE_NAME = 'user_profiles';
const DB_VERSION = 1;

/**
 * Initialize IndexedDB for profile storage
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'userId' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('IndexedDB error: ' + event.target.errorCode);
    };
  });
};

/**
 * Save profile picture data to IndexedDB
 * @param {number|string} userId 
 * @param {string} profilePicData - Base64 string or template path
 */
export const saveProfilePic = async (userId, profilePicData) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ userId, profile_pic: profilePicData, updatedAt: new Date().toISOString() });

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(false);
  });
};

/**
 * Get profile picture data from IndexedDB
 * @param {number|string} userId 
 */
export const getProfilePic = async (userId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(userId);

    request.onsuccess = () => {
      resolve(request.result ? request.result.profile_pic : null);
    };
    request.onerror = () => reject(null);
  });
};
