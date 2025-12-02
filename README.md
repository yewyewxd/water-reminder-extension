# Drink Water Reminder

## Why I made this

I struggled to drink enough water every day. Sometimes, I don't drink at all when I'm in the flow state. This was causing some health issues for me.

I tried 3 different water reminder extensions across 1 year but they are either badly designed or unnecessarily heavy. So, I decided to build my own lightweight, speedy, good-UX extension that reminds me to drink water.

## Local Development

1. Install dependencies

```bash
npm install
```

2. Start the TailwindCSS compilation server

```bash
npm run dev
```

3. Go to [chrome://extensions/](chrome://extensions/)
4. Click `Load unpacked`
5. Select the `src/` folder of this project

## Deployment

1. Compile TailwindCSS and zip the `src/` folder

```bash
npm run build
```

2. Add an item on the [Chrome Extension Store](https://chrome.google.com/webstore/devconsole)

3. Upload the `extension.zip` you have built in step 1 and complete the registration.

4. Submit for review and wait for the good news 🎉
