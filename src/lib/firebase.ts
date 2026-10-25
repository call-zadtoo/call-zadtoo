import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection, 
  addDoc, 
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with Database ID as required by AI Studio skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Real Google Sign-In with popup
export async function signInWithGoogleReal() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save or update user in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        plan: 'free_unlimited',
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    } catch (dbErr) {
      console.warn('Firestore profile sync error:', dbErr);
    }

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    return {
      success: false,
      error: error?.message || 'فشل الاتصال بـ Google',
      code: error?.code,
    };
  }
}

// Log out
export async function signOutReal() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign-out Error:', error);
    return { success: false, error: error?.message };
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };
