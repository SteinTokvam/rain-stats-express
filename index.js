import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get } from "firebase/database";
import express from "express";
import dotenv  from "dotenv";
import cors from "cors";

const app = express();
dotenv.config()
app.use(cors())
console.log(process.env.REACT_APP_FIREBASE_DATABASE_URL)

    async function getRain() {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDING_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
            measurementId: process.env.REACT_APP_FIREBASE_MEASSUREMENT_ID
          };
          
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getDatabase(firebaseApp)
        const dbRef = ref(db);
        const ret = get(child(dbRef, 'rain/')).then((snapshot) => {

        if (snapshot.exists()) {
            const data = snapshot.val()
            const keys = Object.keys(data)
            const ret = []
            console.log("inne i snapshot")
            keys.forEach(function(key) {
                ret.push(data[key])
            })
            return ret
            
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
            console.error(error);
        });
        return ret
    }
    
    app.get("/data", (req, res) => {    
        getRain().then(r => res.send(r))
});

app.listen(6001, () => console.log("Server is listening to port 6001"));