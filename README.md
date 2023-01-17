# NextJS Habit tracker
## Core features
- Authentication
- Create habits with flexible, cron-based schedules
- Manage your habits: update, delete, view your history, etcs
- Update habit progress

## Techstack
- Pocketbase
- NextJS
- Ant design
- TailwindCss

## Development
1. Clone the repo:
```
git clone https://github.com/DustinDust/Nextjs-HabitTracker
```
2. Install dependencies
```
yarn
```
or
```
npm install
```
3. Add environment variables (required)
```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```
4. If you use hosted pocketbase server then you can skip this steps, however, for local development it is recommended to start a local pocketbase instances.
```
yarn migrate:windows
yarn serve:windows
# or
yarn migrate:linux
yarn server:linux
# or 
npm run migrate:windows
npm run serve:windows
# or
npm run migrate:linux
npm run serve:linux
```
5. Start the development server
```
yarn dev
# or
npm run dev
```

# TODOs
- Code refractoring
- Migrate to a global state management library (I'd pick between redux and Jotai)
- Notification (push notification/emails)
- Email verification
- More analytics features
- Write my own backend ( very unlikely XD )

