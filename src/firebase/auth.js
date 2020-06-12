import app from './app.js'
import 'firebase/auth'
import firebase from 'firebase/app'

export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const auth = app.auth()
