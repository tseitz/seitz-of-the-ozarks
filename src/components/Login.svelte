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

{#if user}
  You are logged in as : {user.displayName}
  <button on:click={logoutNow} class="button">Logout</button>
{:else}
  <!-- <button on:click={login} class="button">Login</button> -->
  <button on:click={loginWithGoogle} class="button">Login With Google</button>
{/if}
