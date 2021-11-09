/**
 * Get DB
 * @returns {Promise<IDBDatabase>}
 */
const getDb = () => {
  return new Promise((resolve, reject) => {
    if (!indexedDB) return null;
    const request = indexedDB.open("db");
    /**
     * onupgradeneeded -> db created / upgraded
     */
    request.onupgradeneeded = () => {
      /**
       * db
       * @type {IDBDatabase}
       */
      const db = request.result;
      db.createObjectStore("dataobjects", {
        autoIncrement: true,
      });
      // db.createObjectStore("sending", {
      //   autoIncrement: true,
      // });
      // db.createObjectStore("collections", {
      //   keyPath: "collection",
      // });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => reject(error);
  });
};

/**
 * Add data to DB
 * @param {IDBDatabase} db
 * @param {string} storeName
 * @param {Object} data
 */
const addData = async (db, storeName, data) => {
  console.log("data", data);
  console.log("data", JSON.stringify(data));
  const objectStore = db
    .transaction(storeName, "readwrite")
    .objectStore(storeName);
  const request = objectStore.add(data);
};

/**
 * Updata DB data
 * @param {IDBDatabase} db
 * @param {string} storeName
 * @param {Object} data
 * @param {string} key
 */
const updateData = async (db, storeName, data, key) => {
  const objectStore = db
    .transaction(storeName, "readwrite")
    .objectStore(storeName);
  const request = objectStore.put(data, key);
};

/**
 * Delete DB data
 * @param {IDBDatabase} db
 * @param {string} storeName
 * @param {string} key
 */
const deleteData = async (db, storeName, key) => {
  const objectStore = db
    .transaction(storeName, "readwrite")
    .objectStore(storeName);
  const request = objectStore.delete(key);
};

/**
 * Get Object Store
 * @param {IDBDatabase} db
 * @param {string} storeName
 */
const getObjectStoreLength = async (db, storeName) => {
  const objectStore = db
    .transaction(storeName, "readwrite")
    .objectStore(storeName);

  return new Promise((resolve) => {
    const request = objectStore.count();
    request.onsuccess = function() {
      resolve(request.result);
    };
  });
};

/**
 * Read data with key
 * @param {IDBDatabase} db
 * @param {string} storeName
 */
const readDataWithKey = async (db, storeName) => {
  return new Promise((resolve, reject) => {
    const objectStore = db
      .transaction(storeName, "readonly")
      .objectStore(storeName);
    const request = objectStore.openCursor();
    const res = [];
    /**
     * onsuccess
     * @param {*} e
     * */
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (!cursor) return resolve(res);
      const data = cursor.value;
      data.key = cursor.key;
      res.push(data);
      cursor.continue();
    };
    request.onerror = (error) => reject(error);
  });
};

/**
 * Read data
 * @param {IDBDatabase} db
 * @param {string} storeName
 * @param {string} filter
 */
const readData = async (db, storeName, filter = null) => {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(storeName)
      .objectStore(storeName)
      .getAll(filter);
    /**
     * onsuccess
     * @param {*} e
     */
    request.onsuccess = (e) => resolve(e.target.result);
    /**
     * onerror
     * @param {*} error
     */
    request.onerror = (error) => reject(error);
  });
};

/**
 * Read data
 * @param {IDBDatabase} db
 * @param {string} storeName
 * @param {string} filter
 */
const readDataKeys = async (db, storeName, filter = null) => {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(storeName)
      .objectStore(storeName)
      .getAllKeys(filter);
    /**
     * onsuccess
     * @param {*} e
     */
    request.onsuccess = (e) => resolve(e.target.result);
    /**
     * onerror
     * @param {*} error
     */
    request.onerror = (error) => reject(error);
  });
};
