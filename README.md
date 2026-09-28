# 🎥 Video Meet

A real-time video meeting application that enables users to create and join meetings, communicate through video/audio, and interact with other participants using WebRTC and Socket.IO.

## 🚀 Features

* 🔐 Create and join video meetings
* 🎥 Real-time video calling
* 🎙️ Audio communication
* 🖥️ Screen sharing
* 💬 Real-time messaging
* 👥 Multiple participants
* 🔄 Real-time signaling using Socket.IO
* 🔗 WebRTC peer-to-peer communication
* 📱 Responsive React frontend
* ⚡ Real-time user connection/disconnection handling

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* WebRTC
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* SQLite / PostgreSQL

## 📁 Project Structure

```text
video-meet/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── socket/
│   ├── database/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/ankitkashyap2400/videochatx.git
cd videochatx
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Start the backend

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

The React application will normally run on:

```text
http://localhost:5173
```

## 🔄 How It Works

The application uses **WebRTC** for real-time peer-to-peer audio and video communication.

```text
User A
   │
   │ WebRTC
   ▼
User B

      ▲
      │
 Socket.IO
      │
      ▼
Signaling Server
```

### Signaling Flow

1. User joins a meeting.
2. Client connects to the Socket.IO server.
3. Users exchange connection information through the signaling server.
4. WebRTC creates a peer-to-peer connection.
5. Audio/video streams are exchanged between participants.
6. Socket.IO handles real-time signaling and meeting events.

## 🖥️ Screen Sharing

The application uses the browser's:

```javascript
navigator.mediaDevices.getDisplayMedia()
```

API to capture the user's screen and share it with other participants.

## 🔐 Environment Variables

Create a `.env` file where required:

```env
PORT=5000
DATABASE_URL=your_database_url
CLIENT_URL=http://localhost:5173
```

Do not commit your `.env` file to GitHub.

## 📌 Future Improvements

* 🔒 User authentication with JWT
* 🗄️ PostgreSQL database integration
* ☁️ Deployment to AWS/Render/Railway
* 🔐 HTTPS support
* 🌐 TURN server integration
* 📹 Meeting recording
* 👤 User profiles
* 🔗 Meeting invitation links
* 🎨 Improved UI/UX

## 👨‍💻 Author

**Ankit Kashyap**

GitHub: `https://github.com/ankitkashyap2400`

## 📄 License

This project is created for learning and portfolio purposes.
