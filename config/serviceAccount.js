export default {
  type: 'service_account',
  project_id: process.env.FIRE_PROJ_ID,
  private_key_id: process.env.FIRE_PRIVATE_KEY_ID,
  private_key: process.env.FIRE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: `${process.env.FIRE_PROJ_ID}@appspot.gserviceaccount.com`,
  client_id: process.env.FIRE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIRE_PROJ_ID}%40appspot.gserviceaccount.com`,
}
