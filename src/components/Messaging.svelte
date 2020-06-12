<script>
  import io from "socket.io-client";
  import { stores } from "@sapper/app";
  import { fade } from "svelte/transition";
  import { onMount, onDestroy, tick } from "svelte";

  const placeholder = "Type your message here...";
  const greeting = `You have joined the chat. Use '/name your_nickname' to set your nickname!`;

  $: user = {};
  let socket = "";
  let messages = [greeting];
  let message = "";
  let name = "";
  let numUsersConnected = 0;

  onMount(async function() {
    const { session } = await stores();
    session.subscribe(ses => {
      user = ses.user;
      name = ses.user.displayName;
      socket = io();

      socket.on("message", function(message) {
        messages = messages.concat(message);
        updateScroll();
      });

      socket.on("user joined", function({ message, numUsers }) {
        // console.log($user);
        const mess = ses.user ? `${name} ${message}` : `A new user ${message}`;
        messages = messages.concat(mess);
        numUsersConnected = numUsers;
        updateScroll();
      });

      socket.on("user left", function(numUsers) {
        numUsersConnected = numUsers;
        updateScroll();
      });
    });
  });

  // function emitUserDisconnect() {
  //   socket.emit("user disconnect", name);
  // }

  function handleSubmit() {
    if (message == "") {
      return;
    }

    message = message.trim();

    let messageString = `${name}: ${message}`;

    if (message.slice(0, 5) == "/name") {
      let newName = message.slice(6);
      messageString = `Server: ${name} changed their nickname to ${newName}`;
      name = newName;
    }

    messages = messages.concat(messageString);
    socket.emit("message", messageString);
    updateScroll();
    message = "";
  }

  async function updateScroll() {
    const chatWindow = document.getElementById("chatWindow");
    await tick();

    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  onDestroy(() => {
    socket.emit("user disconnect", name);
  });
</script>

<svelte:head>
  <title>Chat App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- <svelte:window on:unload={emitUserDisconnect} /> -->
<body>
  <div class="main">
    <div id="chatWindow">
      <ul id="messages">
        {#each messages as message}
          <li transition:fade>{message}</li>
        {/each}
      </ul>
    </div>
    <form action="">
      <input id="m" autocomplete="off" {placeholder} bind:value={message} />
      <button on:click|preventDefault={handleSubmit}>Send</button>
    </form>
    <p id="numUsers">
      There {numUsersConnected == 1 ? 'is' : 'are'} {numUsersConnected} {numUsersConnected == 1 ? 'user' : 'users'}
      currently chatting!
    </p>
  </div>
</body>
