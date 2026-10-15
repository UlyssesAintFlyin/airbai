import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile, logOut } from "../services/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsubProfile = null;

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      unsubProfile?.();

      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      unsubProfile = onSnapshot(
        doc(db, "users", fbUser.uid),
        (snap) => {
          setUser(snap.exists() ? { id: snap.id, ...snap.data() } : null);
          setLoading(false);
        },
        (err) => {
          console.error("Profile listener failed:", err);
          setLoading(false); // don't leave the app blank
        },
      );
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser ? await getUserProfile(fbUser.uid) : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout: logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
