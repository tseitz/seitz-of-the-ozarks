<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import Gravatar from "svelte-gravatar";

  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";

  // apparently this stuff is ok to leave public
  let firebaseConfig = {
    apiKey: "AIzaSyDGZWsVAzo9LB6H1SVieHtargEk0fN7DOI",
    authDomain: "seitz-of-the-ozarks.firebaseapp.com",
    databaseURL: "https://seitz-of-the-ozarks.firebaseio.com",
    projectId: "seitz-of-the-ozarks",
    storageBucket: "seitz-of-the-ozarks.appspot.com",
    messagingSenderId: "707694576959",
    appId: "1:707694576959:web:0c8c9fea6b418cbed0bf8a",
    measurementId: "G-0JD9RYK4G9"
  };

  const googleProvider = new firebase.auth.GoogleAuthProvider();

  firebase.initializeApp(firebaseConfig);

  let newMessage = "";
  let email = "test@test.com";
  let password = "testing";
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
  }

  hr {
    height: 1px;
    border: none;
    background: rgb(195, 195, 195);
  }

  Gravatar {
    border-radius: 100%;
  }

  .chat-wrap {
    display: grid;
    grid-template-areas:
      "image name"
      "image message"
      "image message";
    grid-template-columns: 65px 1fr;
    text-align: initial;
  }

  .chat-display-name {
    grid-area: name;
  }

  .chat-profile-pic {
    grid-area: image;
  }

  .chat-message {
    grid-area: message;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <!-- 1. 🔥 Firebase App -->
  <FirebaseApp {firebase} perf>

    <h1>💪🔥 Mode Activated</h1>

    <p>
      <strong>Tip:</strong>
      Open the browser console for development logging.
    </p>

    <!-- 2. 😀 Get the current user -->
    <User let:user let:auth>
      Howdy {user.displayName || user.email} 😀!
      <button on:click={() => auth.signOut()}>Sign Out</button>

      <div slot="signed-out">
        <button on:click={() => auth.signInWithPopup(googleProvider)}>
          Sign In With Google
        </button>
        <button
          on:click={() => auth.signInWithEmailAndPassword(email, password)}>
          Sign In With Email
        </button>
      </div>

      <hr />

      <!-- 3. 📜 Get a Firestore document owned by a user -->
      <Collection path={'chat'} let:data={chats} let:ref={chatRef} log>

        <!-- <img
          src="https://www.gravatar.com/avatar/{chat.emailHash}"
          height="50px"
          alt="gravatar" />
        <h2>{chat.message}</h2> -->

        <!-- <p>
          Document created at
          <em>{new Date(chat.timestamp).toLocaleString()}</em>
        </p> -->

        {#each chats as chat}
          <div class="chat-wrap">
            <!-- <img
              class="chat-profile-pic"
              src="https://www.gravatar.com/avatar/{chat.emailHash}"
              height="60px"
              alt="gravatar" /> -->
            <Gravatar class="chat-profile-pic" size={60} email={user.email} />
            <div class="chat-display-name">
              {chat.displayName}
              <small>{new Date(chat.timestamp).toLocaleString()}</small>
            </div>
            <p class="chat-message">{chat.message}</p>
          </div>
        {/each}

        <span slot="loading">Loading chats...</span>
        <span slot="fallback">
          <button
            on:click={() => chatRef.add({
                displayName: user.displayName || user.email,
                emailHash: 'af9d7c478225dd961293e1bc59a2a943',
                message: '📜 Check out this message',
                timestamp: Date.now()
              })}>
            Create Message
          </button>
        </span>

        <input type="text" bind:value={newMessage} />
        <button
          on:click={() => chatRef.add({
              displayName: user.displayName || user.email,
              emailHash: 'af9d7c478225dd961293e1bc59a2a943',
              message: newMessage,
              timestamp: Date.now()
            })}>
          Add Message
        </button>
      </Collection>
    </User>
  </FirebaseApp>

</main>

<!-- Styles -->
