# RON Donations POC

## Requirements

- Redis running on localhost:6379
- Access to the Webhooks on SkyMavis Developer Portal

## ToDo:

- [ ] Implement Postgres to store custom webhook endpoints
- [ ] Find a way to prevent of address squatting and to only allow one webhook per address
- [ ] Implement webhook creation endpoint that requires address signature and webhook secret.
- [ ] Verify incoming webhook requests with webhook secret

## How to run

1. Clone the repo
2. Run `pnpm install`
3. Run `pnpm build`
4. Run `pnpm start`

This starts the webserver on port 3000.

Use a tool like [ngrok](https://ngrok.com/) to expose the webserver to the internet.

Use the ngrok generated url followed by `/webhook` as the webhook url on the SkyMavis Developer Portal.

!! **Only RON transfers are currently supported** !!

## How to test

1. Open: http://localhost:3000/demo
2. Send a RON transfer to the address you used for the webhook.
3. After a few moments (needs time to confirm the tx and wait for the webhook to be called) you should see a donation alert on 

---

This is just a simple POC to show how to implement a donation system for RON.
This project is not suited for production!
