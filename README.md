# 📈 Real-Time crypto Market Price Proxy  
**Tech Stack:**  
Node.js • Express • MongoDB • JWT • Zod • bcrypt • WebSockets (ws)

This backend system connects to a **real stock exchange (Backpack Exchange WebSocket API)**, receives live price ticks, and broadcasts filtered real-time price updates to users based on their subscriptions.

It also includes:
- User Authentication (Signup/Login)
- Watchlists
- Price Alerts
- WebSocket Live Streaming
- Clean modular architecture
- In-memory subscription state

---

# 🚀 Features

### ✅ Authentication (JWT)
- Signup with bcrypt password hashing  
- Login → returns JWT token  
- Protected routes with middleware  

### ✅ Watchlists
- Users can save symbols in MongoDB  
- Auto-subscribe on WebSocket connection  

### ✅ Price Alerts
- Users create alerts (above/below price)  
- Alerts engine matches every incoming tick  
- Sends WebSocket notification when triggered  

### ✅ Live Price Streaming
- Server connects to Backpack Exchange  
- Receives real price updates  
- Broadcasts ONLY to subscribed users  

### ✅ WebSocket Server
- Real-time communication  
- Users subscribe/unsubscribe dynamically  

---

