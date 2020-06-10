import { auth, google } from './auth'

export const loginWithEmail = async (email, password) => {
  console.log('logging in under ', email, password)

  let promise = auth.signInWithEmailAndPassword(email, password)

  promise
    .then((data) => console.log('finished logging in:', data))
    .catch((e) => console.error(e))

  return promise
}

export const loginWithGoogle = async () => {
  console.log('logging in with google', google)

  let promise = auth.signInWithPopup(google)

  promise
    .then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      console.log(result)
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential
    })
}

export const logout = () => {
  console.log('logging out')
  return auth.signOut()
}
