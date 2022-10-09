self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("push", (event) => {
    const { title, message, icon } = event.data.json();
    self.registration.showNotification(title, { body: message, icon });
});