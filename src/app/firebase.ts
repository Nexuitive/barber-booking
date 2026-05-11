import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0fOV3PzWL-oG75k1J-_sG_475JlZ75lA",
  authDomain: "barber-booking-1baf1.firebaseapp.com",
  projectId: "barber-booking-1baf1",
  storageBucket: "barber-booking-1baf1.firebasestorage.app",
  messagingSenderId: "767782367480",
  appId: "1:767782367480:web:af4b14c281212eb6614b0d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);