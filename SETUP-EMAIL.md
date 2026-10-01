# Booking emails: setup

Every time a parent submits **Book a free demo class** on the website, you get an email at
**shivkaransinghbais1628@gmail.com** with the parent's name, the student's name, grade,
what they are preparing for, their phone number (tap to call) and the time in IST.

The emails are sent by [Resend](https://resend.com). It takes about five minutes to set up.

## 1. Create a free Resend account

Go to [resend.com](https://resend.com) and sign up **with shivkaransinghbais1628@gmail.com**.

This matters: until you verify your own domain (step 6), emails are sent from Resend's test
address `onboarding@resend.dev`, and Resend only delivers those to the email address the
account was created with. Sign up with a different address and the booking emails will not
arrive.

## 2. Create an API key

1. In Resend, open **API Keys** and click **Create API Key**.
2. Name it `Veda website`, keep the permission **Sending access**, and create it.
3. Copy the key (it starts with `re_`). Resend shows it only once.
4. Open the file `.env.local` in the project folder and paste the key after the `=` sign:

   ```
   RESEND_API_KEY=re_your_key_here
   ```

   No spaces and no quotes. `.env.local` is private: it is never uploaded to GitHub.

## 3. Restart the website

Stop the running site (press `Ctrl + C` in the terminal where it runs) and start it again:

```
npm run dev
```

## 4. Send a test booking

1. Open http://localhost:3000, scroll to **Come and see a class** and fill in the form.
   Use a real-looking 10-digit mobile number (starting with 6, 7, 8 or 9).
2. Click **Book a free demo class**. You should see "Thank you. We'll call you within ...".
3. Check your inbox. **The first time, also check the Spam folder**, and if it is there,
   open it and click **Not spam** (or **Report not spam**) so later emails land in your inbox.

If the form shows "We couldn't send your request", the key is missing or wrong: check
`.env.local`, then restart the site again (step 3).

## 5. When the site goes live on Vercel

The key in `.env.local` stays on your computer. For the live site:

1. In Vercel, open your project, then **Settings > Environment Variables**.
2. Add `RESEND_API_KEY` with the same key, for **Production** (and Preview if you use it).
3. Redeploy the site.

## 6. Later (optional): send from your own domain

To send from an address like `bookings@yourdomain.com` (looks more professional and can
send to any inbox):

1. In Resend, open **Domains > Add Domain** and follow the steps (you add a few DNS records
   where your domain is registered).
2. Once it shows **Verified**, change the sender in `lib/site-config.ts`:

   ```ts
   bookingsFrom: "Veda Website <bookings@yourdomain.com>",
   ```

## Good to know

- **Where to change the details:** phone, WhatsApp and email for the whole site are in
  `lib/site-config.ts`. `bookingsInbox` is where booking emails go.
- **Spam protection:** the form has a hidden trap field for bots, the server checks every
  field again, and one device can send at most 3 bookings in 10 minutes (60 per hour
  across the site). This limit is kept in memory, so it resets when the site restarts.
- **Replying to parents:** the form asks for a phone number, not an email. If an email
  field is added later, the booking email's "Reply" will go straight to the parent.
