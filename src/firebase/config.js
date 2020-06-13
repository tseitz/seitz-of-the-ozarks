export default {
  apiKey: process.env.FIRE_API_KEY,
  authDomain: `${process.env.FIRE_PROJ_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIRE_PROJ_ID}.firebaseio.com`,
  projectId: process.env.FIRE_PROJ_ID,
  storageBucket: `${process.env.FIRE_PROJ_ID}.appspot.com`,
  messagingSenderId: process.env.FIRE_SENDER_ID,
  appId: process.env.FIRE_APP_ID,
  messagingSenderId: `G-${process.env.FIRE_MEASUREMENT_ID}`,
}
