<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import md5 from "md5";
  import ChatItems from "./components/ChatItems.svelte";

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
  let chats = [];
  let email = "test@test.com";
  let password = "testing";

  let chatQuery = ref => {
    return ref.orderBy("timestamp").limit(5);
  };

  function getMore(last) {
    chatQuery = ref => {
      return ref
        .orderBy("timestamp")
        .startAfter(last.timestamp)
        .limit(5);
    };
  }

  function createMessage(chatRef, user) {
    chatRef.add({
      displayName: user.displayName || user.email,
      email: user.email,
      emailHash: md5(user.email),
      message: "📜 Check out this message",
      timestamp: Date.now()
    });
    newMessage = "";
  }

  function sendMessage(chatRef, user) {
    chatRef.add({
      displayName: user.displayName || user.email,
      email: user.email,
      emailHash: md5(user.email),
      message: newMessage,
      timestamp: Date.now()
    });
    newMessage = "";
  }
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <!-- 1. 🔥 Firebase App -->
  <FirebaseApp {firebase} perf>

    <h1>🏖 Mode Activated 😎</h1>

    <!-- 2. 😀 Get the current user -->
    <User let:user let:auth>
      <!-- TODO: Replace this with custom component -->
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
      <Collection
        path={'chat'}
        query={chatQuery}
        let:ref={chatRef}
        let:last
        on:data={e => {
          if (!e.detail.data) return;
          chats = [...chats, ...e.detail.data];
        }}
        log>

        <ChatItems {chats} {user} {last} {getMore} />

        <button on:click={getMore(last)} />

        <span slot="loading">Loading chats...</span>
        <span slot="fallback">
          <button on:click={createMessage(chatRef, user)}>
            Create Message
          </button>
        </span>

        <input type="text" bind:value={newMessage} />
        <button on:click={sendMessage(chatRef, user)}>Add Message</button>
      </Collection>
    </User>
  </FirebaseApp>

</main>
