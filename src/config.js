export let config
export let serviceAccount

export default async (env) => {
  config = {
    apiKey: env.FIRE_API_KEY,
    authDomain: `${env.FIRE_PROJ_ID}.firebaseapp.com`,
    databaseURL: `https://${env.FIRE_PROJ_ID}.firebaseio.com`,
    projectId: env.FIRE_PROJ_ID,
    storageBucket: `${env.FIRE_PROJ_ID}.appspot.com`,
    messagingSenderId: env.FIRE_SENDER_ID,
    appId: env.FIRE_APP_ID,
    messagingSenderId: `G-${env.FIRE_MEASUREMENT_ID}`,
  }
  serviceAccount = {
    type: 'service_account',
    project_id: env.FIRE_PROJ_ID,
    private_key_id: env.FIRE_PRIVATE_KEY_ID,
    private_key: env.FIRE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: `${env.FIRE_PROJ_ID}@appspot.gserviceaccount.com`,
    client_id: env.FIRE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${env.FIRE_PROJ_ID}%40appspot.gserviceaccount.com`,
  }
}
