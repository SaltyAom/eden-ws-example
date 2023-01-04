import { Elysia, t } from 'elysia'
import { websocket } from '@elysiajs/websocket'
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia()
    .use(cors())
    .use(websocket())
    .use(
        staticPlugin({
            path: 'public',
            prefix: '/public'
        })
    )
    .get('/', ({ set }) => {
        set.redirect = '/public/index.html'
    })
    .ws('/chat', {
        open(ws) {
            const { room, name } = ws.data.query

            ws.subscribe(room).publish(room, {
                message: `${name} has enter the room`,
                name: 'notice',
                time: Date.now()
            })
        },
        message(ws, message) {
            const { room, name } = ws.data.query

            ws.publish(room, {
                message,
                name,
                time: Date.now()
            })
        },
        close(ws) {
            const { room, name } = ws.data.query

            ws.publish(room, {
                message: `${name} has leave the room`,
                name: 'notice',
                time: Date.now()
            })
        },
        schema: {
            body: t.String(),
            query: t.Object({
                room: t.String(),
                name: t.String()
            }),
            response: t.Object({
                message: t.String(),
                name: t.String(),
                time: t.Number()
            })
        }
    })
    .listen(8080)

export type App = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
