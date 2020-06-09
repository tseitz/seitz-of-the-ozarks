<script>
  export let name;
  import Login from "../components/Login.svelte";
</script>

<style>
  h1 {
    color: purple;
  }
  main {
    margin: 20px;
  }
</style>

<main class="content">

  <h1>Welcome to {name}</h1>

  <Login />

</main>
