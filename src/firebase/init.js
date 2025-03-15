import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
 var config = {
        apiKey: "AIzaSyAdRqxQjPLa00HVWD89gBulAWjB57tXCq0",
        authDomain: "puku-crm-f381c.firebaseapp.com",
        projectId: "puku-crm-f381c",
        storageBucket: "puku-crm-f381c.appspot.com",
        messagingSenderId: "613037956078",
        appId: "1:613037956078:web:92c65709ee80e354b2ccff",
        measurementId: "G-CTK847T55L"
};


 const firebaseApp = firebase.initializeApp(config);
 firebaseApp.firestore().settings({ timestampsInSnapshots:true})

 export default firebaseApp.firestore()
