import { config } from '../config'
import firebase from 'firebase/app'

console.log(config)
export default firebase.initializeApp(config)
