<script lang="ts">
    import type { App } from '../../server/src'

    import { edenTreaty } from '@elysiajs/eden'

    const api = edenTreaty<App>(
        location.origin === 'http://localhost:5173'
            ? 'http://localhost:8080'
            : location.origin
    )

    let room = ''
    let name = ''

    let messages: { message: string; name: string; time: number }[] = []
    let message = ''
    let chat: ReturnType<typeof api['chat']['subscribe']>

    const enterRoom = () => {
        chat = api.chat
            .subscribe({
                // Add query parameters
                $query: {
                    name,
                    room
                }
            })
            .on('message', ({ data }) => {
                messages = [data, ...messages]
            })
    }

    const sendMessage = () => {
        if (!chat) return

        chat.send(message)

        message = ''
    }

    const formatTime = (time: number) => {
        const date = new Date(time)
        let hour: string | number = date.getHours()
        let minute: string | number = date.getMinutes()

        if (hour < 10) hour = '0' + hour
        if (minute < 10) minute = '0' + minute

        return `${hour}:${minute}`
    }
</script>

{#if !chat}
    <form on:submit|preventDefault={enterRoom}>
        <fieldset id="sign-in">
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
        <legend>{room}</legend>
        {#each messages as { time, name, message } (time)}
            <p>[{formatTime(time)}] {name}: {message}</p>
        {/each}
    </fieldset>
    <form on:submit|preventDefault={sendMessage}>
        <fieldset>
            <legend>{name}</legend>

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
