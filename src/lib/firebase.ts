import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';

// Fallback configuration if json config file is not bundled
const config = {
  projectId: "gen-lang-client-0457201225",
  appId: "1:73193815757:web:6d575c078d5171b9b1f384",
  apiKey: "AIzaSyC8ZaMCUTofha9xPdCln-48n__R9WCBMfI",
  authDomain: "gen-lang-client-0457201225.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-visiontoweb-bfad7d71-b15d-42ef-9cf1-1d0bc1e3ea14",
  storageBucket: "gen-lang-client-0457201225.firebasestorage.app",
  messagingSenderId: "73193815757",
  oAuthClientId: "73193815757-ltuv52jpdbdhevf58gbsf9lo2p23sn8c.apps.googleusercontent.com"
};

// Safe initialization
let app: any = null;
let db: any = null;
let auth: any = null;
let googleProvider: any = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(config);
  db = getFirestore(app, config.firestoreDatabaseId);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
} catch (e) {
  console.warn('Firebase init notice:', e);
}

export { app, db, auth, googleProvider };

// Safe onAuthStateChanged wrapper
export function onAuthStateChanged(authInstance: any, callback: (user: FirebaseUser | null) => void) {
  if (!authInstance) {
    return () => {};
  }
  try {
    return fbOnAuthStateChanged(authInstance, callback);
  } catch (e) {
    console.warn('Auth listener error:', e);
    return () => {};
  }
}

// Real Google Sign-In with popup
export async function signInWithGoogleReal() {
  if (!auth || !googleProvider) {
    return {
      success: false,
      error: 'خدمة Firebase غير مهيأة بعد',
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (db) {
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
        console.warn('Firestore profile sync notice:', dbErr);
      }
    }

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    console.warn('Google Sign-In notice:', error);
    return {
      success: false,
      error: error?.message || 'تم إغلاق النافذة أو حظر النوافذ المنبثقة',
      code: error?.code,
    };
  }
}

// Log out
export async function signOutReal() {
  if (!auth) return { success: true };
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.warn('Sign-out error:', error);
    return { success: false, error: error?.message };
  }
}

export type { FirebaseUser };
