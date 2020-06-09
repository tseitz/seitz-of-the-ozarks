<script>
  import ChatItem from "../ChatItem.svelte";
  import { db } from "./firebase";
  import { collectionData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  export let uid;

  let text = "some task";
  const query = db.collection("chat").orderBy("timestamp");
  const chats = collectionData(query, "id").pipe(startWith([]));

  function add() {
    db.collection("chat").add({
      uid,
      text,
      complete: false,
      created: Date.now()
    });
    text = "";
  }

  function updateStatus(event) {
    console.log(event);
    const { id, newStatus } = event.detail;
    db.collection("todos")
      .doc(id)
      .update({ complete: newStatus });
  }

  function removeItem(event) {
    const { id } = event.detail;
    db.collection("todos")
      .doc(id)
      .delete();
  }
</script>

<style>
  input {
    display: block;
  }
</style>

<ul>
  {#each $chats as chat}
    <ChatItem {...chat} on:remove={removeItem} on:toggle={updateStatus} />
  {/each}
</ul>

<input bind:value={text} />

<hr />

<p>
  Your task:
  <strong>{text}</strong>
</p>

<button class="button is-info" on:click={add}>Add Task</button>
