# FoodAI Kitchen — Kitchen Display System (KDS)

Standalone Next.js 15/16 web application designed for kitchen tablets (iPad, Android tablets, touch displays).

## Features
- Tablet PIN login for kitchen staff
- Real-time order dispatch via Socket.io WebSockets
- Large 56px touch target action buttons (Apple HIG compliance)
- Audio alerts on new order arrival
- Color-coded tickets (Yellow = Pending, Blue = Accepted, Orange = Preparing, Green = Ready)

## Deploying

### Option 1: Vercel (1-Click)
1. Push this folder to a GitHub repository: `foodai-kitchen`.
2. Connect to Vercel: Import Repository.
3. Framework Preset: **Next.js**.
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.co.uk`
   - `NEXT_PUBLIC_SOCKET_URL` = `https://api.yourdomain.co.uk`
5. Click **Deploy**.

### Option 2: Netlify
1. Connect GitHub repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `.next`

### Option 3: Docker
```bash
docker build -t foodai-kitchen .
docker run -p 3003:3003 -e NEXT_PUBLIC_API_URL=http://your-api:3001 foodai-kitchen
```
