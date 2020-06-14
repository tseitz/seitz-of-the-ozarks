import { config, serviceAccount } from '../config'
import * as admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL,
})

export default admin
