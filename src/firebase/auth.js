import app from './app.js'
import 'firebase/auth'
import firebase from 'firebase/app'

export const google = new firebase.auth.GoogleAuthProvider()

export const auth = app.auth()
