importScripts("firebaseConfig.js");

const dispatch = ({ data: { type } }) => {
	if (type === "firebaseConfig") self.postMessage({ firebaseConfig, vapidKey });
};

self.addEventListener("message", dispatch);
