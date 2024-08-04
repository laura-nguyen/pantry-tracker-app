import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

require("dotenv").config();

const firebaseConfig = {
  apiKey: "AIzaSyAi5EbtiXcLXK3YGxwRhvmjsd_At2CM12A",
  authDomain: "pantryapp-d0ad9.firebaseapp.com",
  projectId: "pantryapp-d0ad9",
  storageBucket: "pantryapp-d0ad9.appspot.com",
  messagingSenderId: "315292650277",
  appId: "1:315292650277:web:6383bdffd2ecdce32da8cc",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
