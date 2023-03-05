import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAks9mLkaMxTNb_dELtILnL-7ite-OotOs",
    authDomain: "e-commerce-f015d.firebaseapp.com",
    projectId: "e-commerce-f015d",
    storageBucket: "e-commerce-f015d.appspot.com",
    messagingSenderId: "740648217936",
    appId: "1:740648217936:web:44ffee0aeb5ee9bc319055"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
