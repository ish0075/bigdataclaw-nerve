"""
BigDataClaw NERVE Mission Control Server
WebSocket hub for real-time mission orchestration
"""

import asyncio
import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Dict, List, Optional, Set
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nerve-server")


class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.subscriptions: Dict[str, Set[WebSocket]] = {
            'missions': set(),
            'agents': set(),
            'hotmoney': set(),
            'deals': set(),
        }
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"Client connected. Total: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        for channel in self.subscriptions.values():
            channel.discard(websocket)
        logger.info(f"Client disconnected. Total: {len(self.active_connections)}")
    
    def subscribe(self, websocket: WebSocket, channels: List[str]):
        for channel in channels:
            if channel in self.subscriptions:
                self.subscriptions[channel].add(websocket)
                logger.info(f"Subscribed to {channel}")
    
    async def broadcast_to_channel(self, channel: str, message: dict):
        if channel not in self.subscriptions:
            return
        
        disconnected = set()
        for connection in self.subscriptions[channel]:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)


class MissionController:
    """Manages mission lifecycle and agent coordination"""
    
    def __init__(self, manager: ConnectionManager):
        self.manager = manager
        self.active_missions: Dict[str, dict] = {}
        self.mission_queue: asyncio.Queue = asyncio.Queue()
        self.is_running = False
    
    async def start(self):
        """Start the mission processor"""
        self.is_running = True
        asyncio.create_task(self._process_missions())
        logger.info("Mission controller started")
    
    async def stop(self):
        self.is_running = False
    
    async def create_mission(self, mission_data: dict) -> str:
        """Create a new research mission"""
        mission_id = f"M-{datetime.now().strftime('%Y%m%d-%H%M%S')}-{len(self.active_missions)}"
        
        mission = {
            'id': mission_id,
            'status': 'queued',
            'property': mission_data.get('property', {}),
            'phases': [
                {'name': 'Transaction Scout', 'icon': '🎯', 'status': 'pending'},
                {'name': 'Hot Money ID', 'icon': '🔥', 'status': 'pending'},
                {'name': 'Portfolio Match', 'icon': '💼', 'status': 'pending'},
                {'name': 'Agent Finder', 'icon': '👤', 'status': 'pending'},
                {'name': 'Lender Match', 'icon': '🏦', 'status': 'pending'},
            ],
            'currentPhase': 0,
            'progress': 0,
            'logs': [],
            'createdAt': datetime.now().isoformat(),
        }
        
        self.active_missions[mission_id] = mission
        await self.mission_queue.put(mission_id)
        
        # Broadcast mission created
        await self.manager.broadcast_to_channel('missions', {
            'type': 'mission:created',
            'mission': mission
        })
        
        logger.info(f"Created mission {mission_id}")
        return mission_id
    
    async def _process_missions(self):
        """Process missions from the queue"""
        while self.is_running:
            try:
                mission_id = await asyncio.wait_for(
                    self.mission_queue.get(), 
                    timeout=1.0
                )
                await self._execute_mission(mission_id)
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error(f"Error processing mission: {e}")
    
    async def _execute_mission(self, mission_id: str):
        """Execute a mission through all phases"""
        mission = self.active_missions.get(mission_id)
        if not mission:
            return
        
        mission['status'] = 'active'
        
        # Simulate mission execution
        phases = mission['phases']
        for i, phase in enumerate(phases):
            mission['currentPhase'] = i
            phase['status'] = 'active'
            
            # Broadcast phase change
            await self.manager.broadcast_to_channel('missions', {
                'type': 'mission:phase:change',
                'missionId': mission_id,
                'phase': i,
                'phaseName': phase['name'],
                'progress': int((i / len(phases)) * 100)
            })
            
            # Simulate work
            await asyncio.sleep(2)
            
            # Add log
            log = {
                'message': f"Completed {phase['name']} - found {3 + i} results",
                'level': 'info'
            }
            mission['logs'].append(log)
            
            await self.manager.broadcast_to_channel('missions', {
                'type': 'mission:log',
                'missionId': mission_id,
                'log': log
            })
            
            phase['status'] = 'completed'
            mission['progress'] = int(((i + 1) / len(phases)) * 100)
        
        mission['status'] = 'completed'
        await self.manager.broadcast_to_channel('missions', {
            'type': 'mission:complete',
            'missionId': mission_id,
            'mission': mission
        })
        
        logger.info(f"Completed mission {mission_id}")


class HotMoneyTracker:
    """Tracks hot money leads in real-time"""
    
    def __init__(self, manager: ConnectionManager):
        self.manager = manager
        self.leads: List[dict] = []
        self.is_tracking = False
    
    async def start(self):
        """Start tracking hot money"""
        self.is_tracking = True
        asyncio.create_task(self._simulate_hot_money())
        logger.info("Hot money tracker started")
    
    async def stop(self):
        self.is_tracking = False
    
    async def _simulate_hot_money(self):
        """Simulate hot money detection (replace with real data source)"""
        sample_leads = [
            {
                'id': 'HM-001',
                'entity': '2650687 Ontario Ltd',
                'cashAmount': 15000000,
                'saleDate': 'May 2025',
                'location': 'West Lincoln',
                'property': 'Thirty Rd',
                'matchScore': 92,
                'detectedAt': datetime.now().isoformat(),
            },
            {
                'id': 'HM-002',
                'entity': 'Turnberry Holdings Inc',
                'cashAmount': 9840000,
                'saleDate': 'Jan 2025',
                'location': 'Lincoln',
                'property': '4556-4568 Lincoln Ave',
                'matchScore': 88,
                'detectedAt': datetime.now().isoformat(),
            },
        ]
        
        for lead in sample_leads:
            self.leads.append(lead)
            await self.manager.broadcast_to_channel('hotmoney', {
                'type': 'hotmoney:new',
                'lead': lead
            })
        
        # Periodically add new leads
        while self.is_tracking:
            await asyncio.sleep(30)
            # In real implementation, check for new transactions


class AgentSupervisor:
    """Manages agent fleet status"""
    
    def __init__(self, manager: ConnectionManager):
        self.manager = manager
        self.agents: Dict[str, dict] = {
            'transaction-scout': {
                'id': 'transaction-scout',
                'name': 'Transaction Scout',
                'status': 'idle',
                'icon': '🎯',
                'activeMissions': 0,
                'completedMissions': 42,
            },
            'hot-money-tracker': {
                'id': 'hot-money-tracker',
                'name': 'Hot Money Tracker',
                'status': 'active',
                'icon': '🔥',
                'watchingCount': 156,
                'alertCount': 0,
            },
            'portfolio-analyzer': {
                'id': 'portfolio-analyzer',
                'name': 'Portfolio Analyzer',
                'status': 'idle',
                'icon': '💼',
                'pendingCount': 0,
            },
            'agent-finder': {
                'id': 'agent-finder',
                'name': 'Agent Finder',
                'status': 'idle',
                'icon': '👤',
            },
            'lender-matcher': {
                'id': 'lender-matcher',
                'name': 'Lender Matcher',
                'status': 'idle',
                'icon': '🏦',
            },
            'obsidian-sync': {
                'id': 'obsidian-sync',
                'name': 'Obsidian Sync',
                'status': 'idle',
                'icon': '📝',
                'fileCount': 1247,
            },
        }
    
    async def start_agent(self, agent_id: str):
        if agent_id in self.agents:
            self.agents[agent_id]['status'] = 'active'
            await self.manager.broadcast_to_channel('agents', {
                'type': 'agent:status',
                'agentId': agent_id,
                'status': 'active'
            })
    
    async def stop_agent(self, agent_id: str):
        if agent_id in self.agents:
            self.agents[agent_id]['status'] = 'idle'
            await self.manager.broadcast_to_channel('agents', {
                'type': 'agent:status',
                'agentId': agent_id,
                'status': 'idle'
            })
    
    async def pause_agent(self, agent_id: str):
        if agent_id in self.agents:
            self.agents[agent_id]['status'] = 'queued'
            await self.manager.broadcast_to_channel('agents', {
                'type': 'agent:status',
                'agentId': agent_id,
                'status': 'queued'
            })
    
    def get_agents(self) -> List[dict]:
        return list(self.agents.values())


# Global instances
manager = ConnectionManager()
mission_controller = MissionController(manager)
hot_money_tracker = HotMoneyTracker(manager)
agent_supervisor = AgentSupervisor(manager)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    # Startup
    await mission_controller.start()
    await hot_money_tracker.start()
    logger.info("NERVE server started")
    
    yield
    
    # Shutdown
    await mission_controller.stop()
    await hot_money_tracker.stop()
    logger.info("NERVE server stopped")


app = FastAPI(
    title="BigDataClaw NERVE Server",
    description="Real-time mission control for CRE intelligence",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "BigDataClaw NERVE",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "connections": len(manager.active_connections),
        "active_missions": len(mission_controller.active_missions),
        "agents": len(agent_supervisor.agents),
    }


@app.get("/api/agents")
async def get_agents():
    return {"agents": agent_supervisor.get_agents()}


@app.post("/api/agents/{agent_id}/start")
async def start_agent(agent_id: str):
    await agent_supervisor.start_agent(agent_id)
    return {"status": "started", "agentId": agent_id}


@app.post("/api/agents/{agent_id}/stop")
async def stop_agent(agent_id: str):
    await agent_supervisor.stop_agent(agent_id)
    return {"status": "stopped", "agentId": agent_id}


@app.post("/api/agents/{agent_id}/pause")
async def pause_agent(agent_id: str):
    await agent_supervisor.pause_agent(agent_id)
    return {"status": "paused", "agentId": agent_id}


@app.post("/api/missions")
async def create_mission(mission_data: dict):
    mission_id = await mission_controller.create_mission(mission_data)
    return {"missionId": mission_id, "status": "queued"}


@app.get("/api/missions/{mission_id}")
async def get_mission(mission_id: str):
    mission = mission_controller.active_missions.get(mission_id)
    if not mission:
        return {"error": "Mission not found"}, 404
    return mission


@app.get("/api/hotmoney")
async def get_hot_money():
    return {"leads": hot_money_tracker.leads}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    
    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            msg_type = message.get('type')
            
            if msg_type == 'subscribe':
                channels = message.get('channels', [])
                manager.subscribe(websocket, channels)
                await websocket.send_json({
                    'type': 'subscribed',
                    'channels': channels
                })
            
            elif msg_type == 'agent:start':
                agent_id = message.get('agentId')
                await agent_supervisor.start_agent(agent_id)
            
            elif msg_type == 'agent:stop':
                agent_id = message.get('agentId')
                await agent_supervisor.stop_agent(agent_id)
            
            elif msg_type == 'agent:pause':
                agent_id = message.get('agentId')
                await agent_supervisor.pause_agent(agent_id)
            
            elif msg_type == 'mission:create':
                mission_data = message.get('data', {})
                mission_id = await mission_controller.create_mission(mission_data)
                await websocket.send_json({
                    'type': 'mission:created',
                    'missionId': mission_id
                })
            
            elif msg_type == 'ping':
                await websocket.send_json({'type': 'pong'})
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3090)
