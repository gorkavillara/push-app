self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("push", (e) => console.log(e))