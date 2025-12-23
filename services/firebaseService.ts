
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  Timestamp 
} from "firebase/firestore";
import { UserProfile, AgencyWin, NewsItem } from "../types";

// Firebase Configuration integrated from user credentials
const firebaseConfig = {
  apiKey: "AIzaSyDK_YJRqz9wFtiEPhcr5bUEOpoq9blGAZY",
  authDomain: "rocketinsights-6786c.firebaseapp.com",
  projectId: "rocketinsights-6786c",
  storageBucket: "rocketinsights-6786c.firebasestorage.app",
  messagingSenderId: "609721988410",
  appId: "1:609721988410:web:d164a7b8a07314b04acc03",
  measurementId: "G-21QQJMVT2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Handle Firestore errors specifically for permission and connectivity issues.
 */
const handleFirestoreError = (error: any, context: string) => {
  console.error(`Firebase [${context}] Error:`, error);
  
  if (error.code === 'permission-denied') {
    return new Error("Database Access Restricted: Ensure Firestore Rules are set to 'allow read, write: if true;' in the Firebase Console for your project 'rocketinsights-6786c'.");
  }
  
  if (error.code === 'unavailable') {
    return new Error("Network Error: Could not reach the intelligence database.");
  }
  
  return error;
};

// --- Connection Test ---

export const testConnection = async (): Promise<boolean> => {
  try {
    // Attempt a lightweight read to test rules
    const testDoc = doc(db, "connection_test", "status");
    await getDoc(testDoc);
    return true;
  } catch (e) {
    throw handleFirestoreError(e, "ConnectionTest");
  }
};

// --- User Management ---

export const getGlobalUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (e) {
    throw handleFirestoreError(e, "getGlobalUsers");
  }
};

export const saveGlobalUser = async (profile: UserProfile) => {
  try {
    // FORCE SUPER ADMIN logic
    if (profile.email.toLowerCase() === 'nmurthy27@gmail.com') {
      profile.role = 'super_admin';
    }
    
    const userRef = doc(db, "users", profile.email.toLowerCase());
    await setDoc(userRef, {
      ...profile,
      lastActive: Timestamp.now()
    }, { merge: true });
  } catch (e) {
    throw handleFirestoreError(e, "saveGlobalUser");
  }
};

export const deleteGlobalUser = async (email: string) => {
  try {
    if (email.toLowerCase() === 'nmurthy27@gmail.com') {
      throw new Error("Cannot delete primary system administrator.");
    }
    const userRef = doc(db, "users", email.toLowerCase());
    await deleteDoc(userRef);
  } catch (e) {
    throw handleFirestoreError(e, "deleteGlobalUser");
  }
};

export const fetchGlobalUserByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", email.toLowerCase());
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Safety re-force of role
      if (email.toLowerCase() === 'nmurthy27@gmail.com') {
        data.role = 'super_admin';
      }
      return data;
    }
    return null;
  } catch (e) {
    throw handleFirestoreError(e, "fetchGlobalUserByEmail");
  }
};

// --- Intelligence Storage ---

export const saveScanResult = async (queryStr: string, results: AgencyWin[]) => {
  try {
    const scanRef = doc(collection(db, "scans"));
    await setDoc(scanRef, {
      query: queryStr,
      results,
      timestamp: Timestamp.now()
    });
  } catch (e) {
    throw handleFirestoreError(e, "saveScanResult");
  }
};

export const getLatestGlobalScan = async (): Promise<AgencyWin[]> => {
  try {
    const scansCol = collection(db, "scans");
    const q = query(scansCol, orderBy("timestamp", "desc"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data().results as AgencyWin[];
    }
    return [];
  } catch (e) {
    // Don't throw if empty, just return empty list
    return [];
  }
};

// --- Briefing Sync ---

export const saveBriefing = async (region: string, news: NewsItem[]) => {
  try {
    const briefRef = doc(db, "briefings", region.toLowerCase());
    await setDoc(briefRef, {
      news,
      updatedAt: Timestamp.now()
    });
  } catch (e) {
    throw handleFirestoreError(e, "saveBriefing");
  }
};

export const getBriefingByRegion = async (region: string): Promise<NewsItem[] | null> => {
  try {
    const briefRef = doc(db, "briefings", region.toLowerCase());
    const snap = await getDoc(briefRef);
    if (snap.exists()) {
      const data = snap.data();
      const updatedAt = data.updatedAt as Timestamp;
      const now = new Date();
      if (now.toDateString() === updatedAt.toDate().toDateString()) {
        return data.news as NewsItem[];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};
