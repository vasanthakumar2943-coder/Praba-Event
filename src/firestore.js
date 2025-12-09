import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// EVENTS → { name, price, image }
export const addEvent = async (data) => {
  await addDoc(collection(db, "events"), {
    ...data,
  });
};

// SLIDES → { imageUrl, createdAt }
export const addSlide = async ({ imageUrl }) => {
  await addDoc(collection(db, "slides"), {
    imageUrl,
    createdAt: serverTimestamp(),
  });
};

// HIGHLIGHTS → { imageUrl, title, price, description, buttonText, createdAt }
export const addHighlight = async (data) => {
  await addDoc(collection(db, "highlights"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// GALLERY → { imageUrl, type, createdAt }  (type = "image" OR "video")
export const addGalleryItem = async (data) => {
  await addDoc(collection(db, "gallery"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};
