import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDCFn9JsW-zGiPnXnmNXZYXFu7qidJxr5o",
    authDomain: "web-crud-act.firebaseapp.com",
    projectId: "web-crud-act",
    storageBucket: "web-crud-act.firebasestorage.app",
    messagingSenderId: "768994640147",
    appId: "1:768994640147:web:661cd96c1a32746947dae6",
    measurementId: "G-ENVNQ79C88"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);