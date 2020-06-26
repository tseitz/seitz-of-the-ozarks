<script>
  export let chats;
  export let user;

  const today = new Date();

  function isToday(timestamp) {
    return (
      new Date(timestamp).setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)
    );
  }
</script>

<style>
  .chat-wrap {
    display: grid;
    grid-template-columns: 65px auto;
    grid-column-gap: 1em;
    text-align: initial;
    margin-bottom: 1em;
  }

  .chat-profile-pic {
    border-radius: 100%;
    grid-column: 1/1;
    grid-row: 1/3;
    align-self: center;
  }

  .chat-details {
    grid-column: 2/3;
    grid-row: 1/3;
    padding: 1em;
    border-radius: 16px;
    max-width: 750px;
    background-color: pink;
  }

  .chat-wrap.me .chat-details {
    grid-column: 1/2;
    background-color: lightslategray;
  }

  .chat-wrap.me {
    grid-template-columns: auto 65px;
    justify-content: end;
  }

  .chat-wrap.me .chat-profile-pic {
    grid-column: 2/3;
  }

  .chat-wrap.me .chat-display-name {
    grid-column: 1/2;
  }

  .chat-wrap.me .chat-message {
    grid-column: 1/2;
  }
</style>

{#each chats as chat}
  <div class="chat-wrap {chat.email === user.email ? 'me' : ''}">
    <img
      class="chat-profile-pic"
      src="https://www.gravatar.com/avatar/{chat.emailHash}"
      height="60px"
      alt="gravatar" />
    <div class="chat-details">
      <div class="chat-display-name">
        <strong>{chat.displayName}</strong>
        {#if isToday(chat.timestamp)}
          <small>
            Today at {new Date(chat.timestamp).toLocaleTimeString()}
          </small>
        {:else}
          <small>{new Date(chat.timestamp).toLocaleString()}</small>
        {/if}

      </div>
      <p class="chat-message">{chat.message}</p>
    </div>
  </div>
{/each}
