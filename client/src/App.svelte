<script lang="ts">
  import type { App } from '../../server/src'

  import { eden } from '@elysiajs/eden'

  const api = eden<App>(
    location.origin === "http://localhost:5173" 
      ? "http://localhost:3000" 
      : location.origin
  )

  let room = ''
  let name = ''

  let messages: { message: string; name: string; time: number; }[] = []
  let message = ''
  let chat: ReturnType<typeof api['chat']['subscribe']>

  const enterRoom = () => {
    chat = api.chat.subscribe({
      "$query": {
        name,
        room
      }
    }).on("message", (ws) => {
      messages = [ws.data, ...messages]
    })
  }

  const sendMessage = () => {
    if(!chat) return

    chat.send(message)

    message = ''
  }

  const formatTime = (time: number) => {
    const [hour, minute, secondAndUnit] = new Date(time).toLocaleTimeString().split(":")
    const [second, unit] = secondAndUnit.split(" ")

    return `${hour}:${minute} ${unit}`
  }
</script>

{#if !chat}
  <form on:submit|preventDefault={enterRoom}>
    <fieldset>
      <legend>Elysia Chatroom</legend>
      
      <label for="name">Name</label>
      <input 
        required
        id="name" 
        type="text" 
        name="name" 
        placeholder="Your name" 
        autofocus
        bind:value={name} 
      />

      <label for="room">Room</label>
      <input
        required
        id="room"
        type="text"
        name="room"
        placeholder="Room ID"
        bind:value={room}
      />
      
      <button type="submit">Enter room</button>
    </fieldset>
  </form>
{:else}
  <fieldset id="chat">
    <legend>{ room }</legend>
    {#each messages as { time, name, message } (time)}
      <p>[{formatTime(time)}] {name}: {message}</p>
    {/each}
  </fieldset>
  <form on:submit|preventDefault={sendMessage}>
    <fieldset>
      <legend>{ name }</legend>

      <label for="message-box">message</label>
      <input
        required
        id="message-box"
        type="text"
        name="message"
        placeholder="Aa"
        autofocus
        bind:value={message}
      />
      
      <button type="submit">Send</button>
    </fieldset>
  </form>
{/if}
