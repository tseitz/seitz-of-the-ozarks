<script>
  import io from "socket.io-client";
  import { stores } from "@sapper/app";
  import { fade } from "svelte/transition";
  import { onMount, onDestroy, tick } from "svelte";

  const placeholder = "Type your message here...";
  const greeting = `You have joined the chat. Use '/name your_nickname' to set your nickname!`;

  $: user = {};
  $: name = "";
  let socket = null;
  let messages = [];
  let message = "";
  let numUsersConnected = 0;

  onMount(async function() {
    const { session } = await stores();
    session.subscribe(ses => {
      if (ses.user) {
        user = ses.user;
        name = ses.user.displayName;

        if (!socket) {
          socket = io();

          socket.on("get messages", function(newMessages) {
            messages = [
              ...messages,
              ...newMessages,
              {
                displayName: "Server",
                timestamp: Date.now(),
                message: greeting
              }
            ];
            updateScroll();
          });

          socket.on("message", function(message) {
            messages = messages.concat(message);
            updateScroll();
          });

          socket.on("user joined", function({ message, numUsers }) {
            // console.log($user);
            const mess = ses.user
              ? `${name} ${message.message}`
              : `A new user ${message.message}`;
            messages = messages.concat({ message: mess });
            numUsersConnected = numUsers;
            updateScroll();
          });

          socket.on("user disconnect", function(message, numUsers) {
            console.log("left");
            messages = messages.concat(message);
            numUsersConnected = numUsers;
            updateScroll();
          });
        }
      }
    });
  });

  function emitUserDisconnect() {
    socket.emit("user disconnect", name);
  }

  function handleSubmit() {
    if (message == "") {
      return;
    }

    message = message.trim();

    const messageObj = {
      displayName: name,
      message,
      timestamp: Date.now()
    };

    if (message.slice(0, 5) == "/name") {
      let newName = message.slice(6);
      messageObj["displayName"] = "Server";
      messageObj["message"] = `${name} changed their name to ${newName}`;
      name = newName;
    }

    messages = messages.concat(messageObj);
    updateScroll();
    message = "";

    if (messageObj["displayName"] !== "Server")
      socket.emit("message", messageObj);
  }

  async function updateScroll() {
    const chatWindow = document.getElementById("chatWindow");
    await tick();

    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  onDestroy(() => {
    socket.emit("user disconnect", name);
    // socket.disconnect(true);
  });
</script>

<svelte:head>
  <title>Chat App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<svelte:window on:unload={emitUserDisconnect} />
<body>
  <div class="main">
    <div id="chatWindow">
      <ul id="messages">
        {#each messages as message}
          <li transition:fade>
            {#if message.timestamp}
              {new Date(message.timestamp)}
            {:else}{Date.now()}{/if}
            {#if message.displayName}{message.displayName}:{/if}
            {message.message}
          </li>
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
