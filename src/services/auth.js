import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: uid, ...snap.data() } : null;
};

export const signUp = async (rawEmail, password) => {
  const email = rawEmail.trim().toLowerCase();
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // profile doc keyed by auth uid (not a random id)
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    role: "user",
    location: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return getUserProfile(cred.user.uid);
};

export const logIn = async (rawEmail, password) => {
  const email = rawEmail.trim().toLowerCase();
  const cred = await signInWithEmailAndPassword(auth, email, password);

  let profile = await getUserProfile(cred.user.uid);
  if (!profile) {
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role: "user",
      location: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    profile = await getUserProfile(cred.user.uid);
  }
  return profile;
};

export const logOut = () => signOut(auth);

export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email.trim().toLowerCase());