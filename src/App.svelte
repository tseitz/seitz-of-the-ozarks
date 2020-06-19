<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";

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

  let newComment = "";
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1,
  em {
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
  <FirebaseApp {firebase}>

    <h1>💪🔥 Mode Activated</h1>

    <p>
      <strong>Tip:</strong>
      Open the browser console for development logging.
    </p>

    <!-- 2. 😀 Get the current user -->
    <User let:user let:auth>
      Howdy 😀! User
      <em>{user.uid}</em>

      <button on:click={() => auth.signOut()}>Sign Out</button>

      <div slot="signed-out">
        <button on:click={() => auth.signInWithPopup(googleProvider)}>
          Sign In With Google
        </button>
      </div>

      <hr />

      <!-- 3. 📜 Get a Firestore document owned by a user -->
      <Doc path={`chat/${user.uid}`} let:data={chat} let:ref={postRef} log>

        <img
          src="https://www.gravatar.com/avatar/{chat.emailHash}"
          height="50px"
          alt="gravatar" />
        <h2>{chat.message}</h2>

        <p>
          Document created at
          <em>{new Date(chat.timestamp).toLocaleString()}</em>
        </p>

        <span slot="loading">Loading post...</span>
        <span slot="fallback">
          <button
            on:click={() => postRef.set({
                displayName: 'Tegan Seitz',
                emailHash: 'af9d7c478225dd961293e1bc59a2a943',
                message: '📜 Check out this message',
                timestamp: Date.now()
              })}>
            Create Message
          </button>
        </span>

        <input type="text" bind:value={newComment} />
        <button
          on:click={() => postRef.set({
              displayName: 'Tegan Seitz',
              emailHash: 'af9d7c478225dd961293e1bc59a2a943',
              message: newComment,
              timestamp: Date.now()
            })}>
          Add Message
        </button>

        <!-- 4. 💬 Get all the comments in its subcollection -->

        <h3>Comments</h3>
        <Collection
          path={postRef.collection('comments')}
          query={ref => ref.orderBy('createdAt')}
          let:data={comments}
          let:ref={commentsRef}
          log>

          {#if !comments.length}No comments yet...{/if}

          {#each comments as comment}
            <p>
              <!-- ID: <em>{comment.ref.id}</em> -->
            </p>
            <p>
              {comment.text}
              <button on:click={() => comment.ref.delete()}>Delete</button>
            </p>
          {/each}

          <button
            on:click={() => commentsRef.add({
                displayName: 'Tegan Seitz',
                emailHash: 'af9d7c478225dd961293e1bc59a2a943',
                message: newComment,
                timestamp: Date.now()
              })}>
            Add Comment
          </button>

          <span slot="loading">Loading comments...</span>

        </Collection>
      </Doc>
    </User>
  </FirebaseApp>

</main>

<!-- Styles -->
