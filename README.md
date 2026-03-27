# BigDataClaw NERVE Mission Control

Real-time web cockpit for BigDataClaw multi-agent CRE research system.

![BigDataClaw NERVE](https://img.shields.io/badge/BigDataClaw-NERVE-red)
![React](https://img.shields.io/badge/React-19-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)

## Features

### 🎯 Mission Control Dashboard
- Real-time mission tracking and progress
- Hot money radar with live alerts
- Agent fleet status monitoring
- Quick action shortcuts

### 🔥 Hot Money Surveillance
- Track recent sellers with fresh capital
- Real-time transaction monitoring
- Match scoring and alerts
- Geographic distribution analysis

### 🏢 Property Research
- Multi-step research missions
- Transaction scout integration
- Portfolio matching
- Agent finder
- Lender matching

### 📊 Deal Pipeline
- Kanban board view
- Drag-and-drop deal progression
- Contact quick actions
- Deal statistics and summaries

### 🤖 Agent Workspace
- Agent fleet management
- Start/stop/pause agents
- Live log streaming
- Agent configuration

### 📝 Obsidian Vault Integration
- Vault browser
- Note preview
- Sync status
- One-click export

### 🎙️ Voice Control
- Push-to-talk interface
- Natural language commands
- Voice-to-form auto-fill

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NERVE Mission Control                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 19 + Vite + Tailwind + Zustand)           │
│  ├── Mission Control View                                  │
│  ├── Property Research                                     │
│  ├── Hot Money Radar                                       │
│  ├── Deal Pipeline                                         │
│  ├── Agent Workspace                                       │
│  ├── Obsidian Vault                                        │
│  └── Settings                                              │
├─────────────────────────────────────────────────────────────┤
│  Backend (FastAPI + WebSocket)                             │
│  ├── Mission Controller                                    │
│  ├── Agent Supervisor                                      │
│  ├── Hot Money Tracker                                     │
│  └── Connection Manager                                    │
├─────────────────────────────────────────────────────────────┤
│  BigDataClaw Core (Python)                                 │
│  ├── matching_engine.py                                    │
│  ├── orchestrator.py                                       │
│  ├── obsidian_integration.py                               │
│  └── api_server.py                                         │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

```bash
# Clone and navigate to nerve directory
cd nerve

# Install frontend dependencies
npm install

# Install backend dependencies
cd nerve_server
pip install -r requirements.txt
```

### Development

```bash
# Terminal 1: Start the WebSocket server
cd nerve_server
python main.py

# Terminal 2: Start the frontend dev server
cd nerve
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3090
- WebSocket: ws://localhost:3090/ws

### Production Build

```bash
cd nerve
npm run build
```

## Environment Variables

Create a `.env` file in the `nerve` directory:

```env
VITE_WS_URL=ws://localhost:3090/ws
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
nerve/
├── src/
│   ├── components/
│   │   ├── Agent/          # Agent fleet components
│   │   ├── Common/         # Layout, Sidebar, TopBar
│   │   ├── Deal/           # Deal card, Offer writer
│   │   ├── Mission/        # Active missions, Hot money radar
│   │   ├── Obsidian/       # Vault browser, Note preview
│   │   ├── Property/       # Property card, Match score ring
│   │   └── System/         # Voice control, Usage meter
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state management
│   ├── views/              # Main page views
│   ├── App.jsx
│   └── main.jsx
├── nerve_server/           # FastAPI WebSocket server
│   ├── main.py
│   └── requirements.txt
├── dist/                   # Production build
└── package.json
```

## WebSocket Events

### Client → Server
- `subscribe` - Subscribe to channels (missions, agents, hotmoney)
- `mission:create` - Create new research mission
- `agent:start` - Start an agent
- `agent:stop` - Stop an agent
- `agent:pause` - Pause an agent

### Server → Client
- `mission:created` - New mission started
- `mission:phase:change` - Mission phase transition
- `mission:complete` - Mission finished
- `agent:status` - Agent status update
- `agent:log` - Agent log message
- `hotmoney:new` - New hot money lead detected

## Voice Commands

The voice interface supports natural language commands:

- "Find hot money buyers in Welland"
- "Show me the deal pipeline"
- "Start property research"
- "Open agent workspace"

## License

MIT - BigDataClaw Team
