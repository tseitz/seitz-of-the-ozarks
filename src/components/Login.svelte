Howdy {user.displayName || user.email} 😀!
<button on:click={() => auth.signOut()}>Sign Out</button>

<div slot="signed-out">
  <button on:click={() => auth.signInWithPopup(googleProvider)}>
    Sign In With Google
  </button>
  <button on:click={() => auth.signInWithEmailAndPassword(email, password)}>
    Sign In With Email
  </button>
</div>
