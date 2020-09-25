import firebaseApp from "./Firebase";

// import * as firebase from "firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const db = firebase.firestore(firebaseApp);

export async function isUserAdmin(uid) {
  const response = await db.collection("admins").doc(uid).get();
  return response.exists;
}

export const reauthenticate = (password) => {
  const user = firebase.auth().currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );

  return user.reauthenticateWithCredential(credentials);
};
