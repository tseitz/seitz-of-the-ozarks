<script>
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  const { session } = stores();

  let client;
  $: user = $session.user;

  onMount(async () => {
    if (process.browser) {
      client = await import("../firebase/firebase.js");
    }
  });

  // function login() {
  //   client.loginWithEmail("test@test.com", "testing").then(u => {
  //     console.error("logged", $session.user);
  //   });
  // }

  function logoutNow() {
    client.logout().then(() => {
      console.log("logged out");
    });
  }

  function loginWithGoogle() {
    client.loginWithGoogle().then(u => {
      console.log(u);
    });
  }
</script>

<style>
  .login-button,
  .logout-button {
    margin: 10px 0;
  }
</style>

{#if user}
  <div>You are logged in as: {user.displayName}</div>
  <div class="logout-button">
    <button on:click={logoutNow} class="button">Logout</button>
  </div>
{:else}
  <div class="login-button">
    <button on:click={loginWithGoogle} class="button">Login With Google</button>
  </div>
  <!-- <button on:click={login} class="button">Login</button> -->
{/if}
