import axios from "axios";

const PUBLIC_VAPID_KEY =
  import.meta.env.VITE_PUBLIC_VAPID_KEY;
const localStorageKey = "pushapp-subscription-id";
export const registerSubscription = async (JSONSub) => {
  const url = import.meta.env.VITE_SUBSCRIPTION_ENDPOINT

  try {
    const res = await axios.post(url, {
        action: "registerSubscription",
        subscription: { subscription: JSONSub },
    })
    // const res = await axios.post(url, {
    //     action: "nuevoAlumno",
    //     alumno: {
    //         username: "prueb",
    //         email: "prueb",
    //         password: "prueb"
    //     },
    // })
    return res;
  } catch (e) {
    console.error("Error de fetch", e);
    throw e;
  }
};

export const registerWorker = async () => {
  if (!"serviceWorker" in navigator) return;
  const reg = await navigator.serviceWorker.register("/sw.js");
  askPermission(reg);
};

const subscribeToPushService = async (registration) => {
  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: PUBLIC_VAPID_KEY,
  });
};

export const askPermission = async (registration) => {
  const permissionResult = await Notification.requestPermission();

  if (permissionResult !== "granted") {
    localStorage.removeItem(localStorageKey);
    return console.log("Permiso push denegado");
  }

  const subscription = await subscribeToPushService(registration);
  const parsed_subscription = JSON.parse(JSON.stringify(subscription));
  if (
    localStorage.getItem(localStorageKey) !== null ||
    localStorage.getItem(localStorageKey) === parsed_subscription.keys.p256dh
  )
    return;
  console.log(JSON.stringify(subscription));

  try {
    const response = await registerSubscription(JSON.stringify(subscription));
    console.log("response", response);
    const subscriptionId = JSON.parse(JSON.stringify(subscription)).keys.p256dh;
    localStorage.setItem(localStorageKey, subscriptionId);
    console.log("Permiso concedido");
  } catch (error) {
    console.error(error);
  }
};
