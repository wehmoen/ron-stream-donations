import express from "express";
import {createServer} from 'node:http';
import path from "node:path";
import {fileURLToPath} from "node:url";
import {Server} from "socket.io";
import {createAdapter} from "@socket.io/redis-adapter";
import {createClient} from "redis";
import {SubscribePayload, SubscribePayloadSchema} from "./validation.js";
import {ErrorBadPayload} from "./errors.js";
import {getAddress} from "ethers";
import {handler} from "./handler/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.set("x-powered-by", false);

const pubClient = createClient({url: "redis://localhost:6379"});
const subClient = pubClient.duplicate();

app.get('/', (req, res) => {
    res.send("Nothing to see here. Move along.")
});

app.post("/account/create", handler.account.create)
app.post("/account", handler.account.get)

app.post("/webhook", (req, res) => {
    const activities = req.body.event.activities;

    for (const activity of activities) {
        io.in(getAddress(activity.toAddress)).emit("tip", {
            type: req.body.type,
            eventId: req.body.eventId,
            network: req.body.event.network,
            activity
        });
    }

    return res.status(200).end()
})

app.get('/demo', (req, res) => {
    res.sendFile("./demo.html", {root: __dirname});
})

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {

    console.log([socket.id], "connected")

    socket.on("subscribe", async (data: SubscribePayload) => {

        const body = SubscribePayloadSchema.validate(data)

        if (body.error !== undefined) {
            console.log(SubscribePayloadSchema.validate(data).error)
            return socket.emit("error", ErrorBadPayload);
        }

        const address = getAddress((body.value as SubscribePayload).address);

        socket.join(address);
        socket.emit("subscribed", {address});
        console.log([socket.id, "subscribe"], "subscribed", address)
    })

    socket.on("disconnect", () => {
        console.log([socket.id], "disconnected")
    })

});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    server.listen(3000, () => {
        console.log('server running at http://localhost:3000');
    });
});


