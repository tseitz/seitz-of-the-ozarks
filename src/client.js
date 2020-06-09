import * as sapper from '@sapper/app'

import firebase from 'firebase/app' // rollup bundle issue with ESM import
import 'firebase/auth'
import 'firebase/firestore'
import { config } from 'dotenv'

config()

var firebaseConfig = {
  apiKey: process.env.FIRE_API_KEY,
  authDomain: process.env.FIRE_AUTH_DOMAIN,
  databaseURL: process.env.FIRE_DB_URL,
  projectId: process.env.FIRE_PROJ_ID,
  storageBucket: process.env.FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRE_SENDER_ID,
  messagingSenderId: process.env.FIRE_APP_ID,
  messagingSenderId: process.env.FIRE_MEASUREMENT_ID,
}

firebase.initializeApp(firebaseConfig)
// firebase.analytics()

export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const db = firebase.firestore()

sapper.start({
  target: document.querySelector('#sapper'),
})
