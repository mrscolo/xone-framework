const version = "v1.0.0.1";

// Cache
const staticCacheName = "static-xone";
const filesCacheName = "files-xone";
const dynamicCacheName = "dynamic-xone";

const maxFilesCacheValue = 100;
const maxDynamicCacheValue = 100;

// Indexed DB
importScripts("./js/IndexedDb.js");

// Base64-js
importScripts("./modules/base64-js/base64-js.min.js");

const maxDataObjectsValue = 100;
const storeName = "dataobjects";

// TODO: en la instalacion del framework agregar todos los ficheros para que se instalen con el sw
const staticSources = ["/", "/index.html", "/configuration.js", "/favicon.ico"];

/**
 * SW install
 */
self.addEventListener(
	"install",
	// Skip waiting
	() => self.skipWaiting()
);

/**
 * SW activate
 */
self.addEventListener("activate", (e) => {
	console.log(`%c sw activated version ${version} `, "background: green; color: white; display: block;");

	const installPromise = caches
		// Clear caches
		.keys()
		.then((keys) => {
			keys.forEach((key) => caches.delete(key));
		})
		// Clear IndexedDB
		.then(() => clearIndexedDB())
		// Add new instalation static cache
		.then(() => caches.open(staticCacheName).then((cache) => cache.addAll(staticSources)));

	e.waitUntil(installPromise);
});

/**
 * SW fetch
 */
self.addEventListener("fetch", (e) => {
	//
	// -> network with indexedDBFallback
	if (
		e.request.method !== "GET" ||
		e.request.url.includes("sockjs-node") ||
		e.request.url.includes("chrome-extension") ||
		e.request.url.includes("manifest")
	) {
		return e.respondWith(networkWithIndexedDBFallback(e));
	}

	//
	// No connection -> cache only
	if (!navigator.onLine) return e.respondWith(caches.match(e.request));

	//
	// Static cache -> cache with network fallback
	if (e.request.url.startsWith(location.href.replace("/sw.js", ""))) {
		//
		// Files cache
		if (e.request.url.includes("/files/")) return e.respondWith(cacheWithNetworkFallback(e, filesCacheName, maxFilesCacheValue));
		//
		// Static application resources
		// return e.respondWith(cacheWithNetworkFallback(e, staticCacheName));
		return e.respondWith(networkWithCacheFallback(e));
	}

	if (!e.request.url.includes("tile")) {
		//
		// Dynamic cache -> network with cache fallback
		const resDynamicPromise = networkWithCacheFallback(e);

		return e.respondWith(resDynamicPromise);
	}
});

/**
 * Network First then IndexedDB
 * @param {*} e
 */
const networkWithIndexedDBFallback = async (e) => {
	const reqClone = e.request.clone();

	try {
		const res = await fetch(e.request);
		if (res) {
			// Request successful
			if (res.type === "cors") {
				reqClone.text().then(async (body) => {
					if (!body.includes("grant_type=client_credentials") && !body.includes('"select"') && !body.includes('"count"')) return;
					// Store data into indexedDB
					res.json().then(async (data) => {
						const db = await getDb();
						await updateData(db, storeName, Base64.encode(JSON.stringify(data)), Base64.encode(body));
						//await updateData(db, storeName, btoa(JSON.stringify(data)), btoa.encode(body));
						// Clear extra data
						clearIndexedDB(maxDataObjectsValue);
					});
				});
			}

			return res.clone();
		}
	} catch (ex) {
		console.error("Request error", ex);
	}

	// Request failed
	const body = await reqClone.text();
	const db = await getDb();
	const data = await readData(db, storeName, Base64.encode(body));
	if (data.length && data.length !== 0) return new Response(Base64.decode(data[0]));
	// if (data) return new Response(atob(data));
};

/**
 * Network with cache fallback
 * @param {*} e
 * @returns {Promise<Response>}
 */
const networkWithCacheFallback = async (e) => {
	try {
		const res = await fetch(e.request);
		if (res) {
			const cache = await caches.open(dynamicCacheName);
			cache.put(e.request, res.clone());
			clearCache(dynamicCacheName, maxDynamicCacheValue);
			return res;
		}
	} catch (ex) {
		console.error("Request error", ex);
	}

	return await caches.match(e.request);
};

/**
 * Cache with network fallback
 * @param {*} e
 * @param {string} cacheName
 * @param {number} [maxCacheValues]
 * @returns {Promise<Response>}
 */
const cacheWithNetworkFallback = async (e, cacheName, maxCacheValues) => {
	const cache = await caches.open(cacheName);
	if (cache) {
		const cacheRes = await cache.match(e.request);
		const fetchRes = addCache(e, cacheName, maxCacheValues);
		return cacheRes || fetchRes;
	}
	return addCache(e, cacheName, maxFilesCacheValue);
};

/**
 * Add Cache
 * @param {*} e
 * @param {string} cacheName
 * @param {number} [limit]
 * @returns {Promise<Response>}
 */
const addCache = async (e, cacheName, limit) => {
	const res = await fetch(e.request);
	if (!res) return res;
	caches.open(cacheName).then((cache) => {
		cache.put(e.request, res);
		if (limit) clearCache(cacheName, limit);
	});

	return res.clone();
};

/**
 * Clear Cache
 * @param {string} cacheName
 * @param {number} maxValues
 */
const clearCache = (cacheName, maxValues) => {
	caches.open(cacheName).then((cache) => {
		cache.keys().then((keys) => {
			if (keys.length > maxValues) {
				cache.delete(keys[0]);
				clearCache(cacheName, maxValues);
			}
		});
	});
};

/**
 * Clear IndexedDB
 * @param {number} [maxValues]
 */
const clearIndexedDB = async (maxValues = 0) => {
	const db = await getDb();
	const length = await getObjectStoreLength(db, storeName);
	const keys = await readDataKeys(db, storeName);
	if (length > maxValues) {
		for (let i = 0; i < length - maxValues; i++) {
			await deleteData(db, storeName, keys[i]);
		}
	}
};
