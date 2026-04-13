import { FirebaseError, initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  FirebaseUser,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import type {
  User,
  Order,
  Complaint,
  UserRole,
  OrderStatus,
  ComplaintStatus,
} from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
export const analytics: Analytics | null =
  typeof window !== "undefined" && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    ? getAnalytics(app)
    : null;

export interface OrderInput extends Omit<
  Order,
  "id" | "createdAt" | "updatedAt"
> {
  status?: OrderStatus;
}

export interface ComplaintInput extends Omit<
  Complaint,
  "id" | "createdAt" | "updatedAt"
> {
  status?: ComplaintStatus;
}

export function getAuthErrorMessage(error: FirebaseError): string {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled.";
    case "auth/popup-blocked-by-user":
      return "Popup was blocked. Allow popups and try again.";
    case "auth/operation-not-supported-in-this-environment":
      return "Popup sign-in is not supported in this environment. Redirecting to Google sign-in.";
    case "auth/cancelled-popup-request":
      return "Popup sign-in was cancelled. Please try again.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for Firebase Google sign-in. Add the current URL to Firebase Auth domains.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export async function saveUserToFirestore(
  user: FirebaseUser,
  extra: Partial<User> = {},
): Promise<User> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const existingData = snapshot.exists()
    ? (snapshot.data() as Partial<User>)
    : {};

  const profile: User = {
    uid: user.uid,
    fullName:
      user.displayName ||
      extra.fullName ||
      existingData.fullName ||
      "UNN Student",
    email: user.email || existingData.email || "",
    photoURL: user.photoURL || extra.photoURL || existingData.photoURL || null,
    role:
      (existingData.role as UserRole | undefined) || extra.role || "student",
    createdAt:
      snapshot.exists() && existingData.createdAt
        ? existingData.createdAt
        : serverTimestamp(),
    updatedAt: serverTimestamp(),
    isVerified: existingData.isVerified ?? user.emailVerified ?? false,
    isActive: existingData.isActive ?? true,
    ...existingData,
    ...extra,
  } as User;

  await setDoc(userRef, profile as any, { merge: true });
  return profile;
}

export async function getUserFromFirestore(uid: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists()
    ? ({ uid: snapshot.id, ...(snapshot.data() as User) } as User)
    : null;
}

export async function signInWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: fullName });
  }

  await saveUserToFirestore(credential.user, {
    fullName,
    role: "student",
    isVerified: false,
  });
  return credential;
}

export function logOut() {
  return signOut(auth);
}

export { signInWithEmail as loginWithEmail };
export { getUserFromFirestore as fetchUserProfile };
export { saveUserToFirestore as saveUserProfile };
export { logOut as signOut };

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function createOrder(orderData: OrderInput): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), {
    ...orderData,
    status: orderData.status || "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserOrders(uid: string): Promise<Order[]> {
  const ordersQuery = query(
    collection(db, "orders"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Order),
  }));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const snapshot = await getDoc(doc(db, "orders", orderId));
  return snapshot.exists()
    ? ({ id: snapshot.id, ...(snapshot.data() as Order) } as Order)
    : null;
}

export async function createComplaint(data: ComplaintInput): Promise<string> {
  const ref = await addDoc(collection(db, "complaints"), {
    ...data,
    status: data.status || "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserComplaints(uid: string): Promise<Complaint[]> {
  const complaintsQuery = query(
    collection(db, "complaints"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(complaintsQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Complaint),
  }));
}
