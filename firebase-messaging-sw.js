importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js");

importScripts("firebaseConfig.js");

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	if (payload.notification?.title || payload.notification?.body) return;
	if (!payload.data) return;

	const title = payload.data?.notification_title;
	const body = payload.data?.notification_message;
	const icon = payload.data?.icon;
	const image = payload.data?.image;
	const notificationOptions = {
		body,
		icon,
		image,
		vibrate: [200, 100, 200, 100, 200, 100, 200],
		tag: "vibration-sample",
	};
	self.registration.showNotification(title, notificationOptions);
});
