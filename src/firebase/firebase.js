import { auth, googleProvider } from './auth'

// export const loginWithEmail = async (email, password) => {
//   console.log('logging in under ', email, password)

//   let promise = auth.signInWithEmailAndPassword(email, password)

//   promise
//     .then((data) => console.log('finished logging in:', data))
//     .catch((e) => console.error(e))

//   return promise
// }

export const loginWithGoogle = async () => {
  console.log('logging in with google')

  let promise = auth.signInWithPopup(googleProvider)

  return promise
    .then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken
      // The signed-in user info.
      const user = result.user
      return result
    })
    .catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.email
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential
      console.log(error)
      return error
    })
}

export const logout = () => {
  console.log('logging out')
  return auth.signOut()
}
