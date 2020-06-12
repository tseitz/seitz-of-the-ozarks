<script>
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";

  let { session } = stores();
  let loading = false;

  onMount(async () => {
    if (process.browser) {
      const { auth } = await import("../firebase/auth.js");

      auth.onAuthStateChanged(user => {
        if (user) {
          session.update(s => {
            s.user = user;
            return s;
          });
          console.log("session updated", $session.user);
        } else {
          session.update(s => {
            s.user = undefined;
            return s;
          });
          console.log("session updated", $session.user);
        }
        loading = false;
      });
    }
  });

  export let segment;
</script>

<Nav {segment} />

<main>
  <slot />
</main>
