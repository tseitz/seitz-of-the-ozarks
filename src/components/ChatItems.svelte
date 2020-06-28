<script>
  import { onMount } from "svelte";
  export let chats;
  export let user;
  export let last;
  export let getMore;

  const today = new Date();
  let targets = [];
  let observerCount = 0;

  // observe intersection
  onMount(() => {
    targets = document.querySelectorAll(".chat-wrap");
    observerCount = targets.length;

    targets.forEach(lazyLoad);
  });

  let options = {
    root: document.querySelector("#chat-box"),
    rootMargin: "0px",
    threshold: 1.0
  };

  function isToday(timestamp) {
    return (
      new Date(timestamp).setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)
    );
  }

  function lazyLoad(target) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observerCount--;
          observer.disconnect();
          if (observerCount < 3) {
            console.log(observerCount);
            getMore(last);
          }
        }
      });
    });

    io.observe(target);
  }
</script>

<style>
  #chat-box {
    max-height: 200px;
    overflow: scroll;
  }

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
    max-width: 600px;
    background-color: #eee;
  }

  .chat-message {
    margin: 0.5em 0;
  }

  .chat-wrap.me .chat-details {
    grid-column: 1/2;
    background-color: cadetblue;
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

<div id="chat-box">
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
</div>
