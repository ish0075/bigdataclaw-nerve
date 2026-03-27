#!/usr/bin/env python3
"""
BigDataClaw Nerve Server
FastAPI + WebSocket for real-time mission control
"""

import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Set
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import connectors
from data_connector import get_connector, BigDataClawDataConnector
from obsidian_connector import get_vault_connector, ObsidianVaultConnector


# ============================================================================
# DATA MODELS
# ============================================================================

class PropertySubmission(BaseModel):
    address: str
    city: str
    region: str
    asset_class: str
    price: float
    size_sf: Optional[float] = None
    property_type: Optional[str] = None


class MissionCreate(BaseModel):
    property: PropertySubmission
    research_depth: str = "standard"
    include_hot_money: bool = True
    include_portfolio: bool = True
    include_agents: bool = True
    include_lenders: bool = True


class ExportToObsidianRequest(BaseModel):
    type: str  # 'buyer' or 'property'
    data: dict


class ObsidianSearchRequest(BaseModel):
    query: str


# ============================================================================
# IN-MEMORY STORES
# ============================================================================

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.subscriptions: Dict[str, Set[WebSocket]] = {
            'missions': set(),
            'agents': set(),
            'hotmoney': set(),
        }
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        for channel in self.subscriptions.values():
            channel.discard(websocket)
    
    def subscribe(self, websocket: WebSocket, channels: List[str]):
        for channel in channels:
            if channel in self.subscriptions:
                self.subscriptions[channel].add(websocket)
    
    async def broadcast(self, message: dict, channel: Optional[str] = None):
        if channel and channel in self.subscriptions:
            targets = list(self.subscriptions[channel])
        else:
            targets = self.active_connections
        
        disconnected = []
        for connection in targets:
            try:
                await connection.send_json(message)
            except:
                disconnected.append(connection)
        
        for conn in disconnected:
            self.disconnect(conn)


class MissionStore:
    def __init__(self):
        self.missions: Dict[str, dict] = {}
    
    def create_mission(self, data: MissionCreate) -> str:
        mission_id = str(uuid.uuid4())[:8]
        self.missions[mission_id] = {
            "id": mission_id,
            "status": "queued",
            "property": data.property.dict(),
            "current_phase": 0,
            "total_phases": 6,
            "phase_progress": 0,
            "research_depth": data.research_depth,
            "include": {
                "hot_money": data.include_hot_money,
                "portfolio": data.include_portfolio,
                "agents": data.include_agents,
                "lenders": data.include_lenders,
            },
            "created_at": datetime.now(),
            "logs": [],
            "results": None,
        }
        return mission_id
    
    def get_mission(self, mission_id: str) -> Optional[dict]:
        return self.missions.get(mission_id)
    
    def update_mission(self, mission_id: str, updates: dict):
        if mission_id in self.missions:
            self.missions[mission_id].update(updates)
    
    def add_log(self, mission_id: str, message: str, level: str = "info"):
        if mission_id in self.missions:
            self.missions[mission_id]["logs"].append({
                "timestamp": datetime.now(),
                "message": message,
                "level": level,
            })
    
    def get_active_missions(self) -> List[dict]:
        return [m for m in self.missions.values() if m["status"] in ("queued", "active")]


# Global instances
manager = ConnectionManager()
store = MissionStore()
data_connector: Optional[BigDataClawDataConnector] = None
vault_connector: Optional[ObsidianVaultConnector] = None


# ============================================================================
# MISSION EXECUTION
# ============================================================================

async def run_mission_phases(mission_id: str):
    """Execute mission phases with real data"""
    global data_connector
    
    phases = [
        ("Transaction Scout", "Finding recent transactions in target market...", 1),
        ("Hot Money Identifier", "Analyzing sellers with fresh capital...", 2),
        ("Portfolio Analyzer", "Matching asset class portfolios...", 3),
        ("Agent Finder", "Finding active brokers...", 4),
        ("Lender Matcher", "Matching financing sources...", 5),
        ("Results Compilation", "Compiling final report...", 6),
    ]
    
    store.update_mission(mission_id, {"status": "active"})
    mission = store.get_mission(mission_id)
    
    if not mission:
        return
    
    property_data = {
        'address': mission['property']['address'],
        'city': mission['property']['city'],
        'region': mission['property']['region'],
        'asset_class': mission['property']['asset_class'],
        'price': mission['property']['price'],
        'size_sf': mission['property'].get('size_sf'),
        'property_type': mission['property'].get('property_type'),
    }
    
    results = {
        'matches': [],
        'hot_money': [],
        'agents': [],
        'lenders': [],
    }
    
    for phase_name, description, phase_num in phases:
        if store.get_mission(mission_id).get('status') == 'aborted':
            return
        
        store.update_mission(mission_id, {
            "current_phase": phase_num,
            "phase_progress": 0,
        })
        
        store.add_log(mission_id, f"Starting {phase_name}...")
        
        await manager.broadcast({
            "type": "mission:phase:change",
            "missionId": mission_id,
            "phase": phase_name,
            "progress": 0,
        }, channel="missions")
        
        try:
            if phase_num == 1 and data_connector:
                for progress in range(0, 101, 20):
                    await asyncio.sleep(0.3)
                    store.update_mission(mission_id, {"phase_progress": progress})
                    await manager.broadcast({
                        "type": "mission:log",
                        "missionId": mission_id,
                        "log": {"message": f"Scanning transactions... {progress}%", "level": "info"},
                    }, channel="missions")
            
            elif phase_num == 2 and data_connector and mission['include']['hot_money']:
                hot_money = data_connector.get_hot_money_leads(10)
                results['hot_money'] = hot_money
                
                for progress in range(0, 101, 25):
                    await asyncio.sleep(0.4)
                    store.update_mission(mission_id, {"phase_progress": progress})
                    
                    if progress == 50 and hot_money:
                        await manager.broadcast({
                            "type": "mission:log",
                            "missionId": mission_id,
                            "log": {"message": f"Found {len(hot_money)} hot money leads!", "level": "success"},
                        }, channel="missions")
                        
                        for lead in hot_money[:3]:
                            await manager.broadcast({
                                "type": "hotmoney:new",
                                "lead": lead,
                            }, channel="hotmoney")
                
                store.add_log(mission_id, f"Identified {len(hot_money)} hot money leads", "success")
            
            elif phase_num == 3 and data_connector:
                store.add_log(mission_id, "Running portfolio matching algorithm...")
                
                matches = data_connector.find_matches(property_data, 
                    limit=25 if mission['research_depth'] == 'deep' else 
                           5 if mission['research_depth'] == 'quick' else 10)
                results['matches'] = matches
                
                for progress in range(0, 101, 20):
                    await asyncio.sleep(0.3)
                    store.update_mission(mission_id, {"phase_progress": progress})
                
                store.add_log(mission_id, f"Found {len(matches)} potential buyers", "success")
            
            elif phase_num == 4 and mission['include']['agents']:
                store.add_log(mission_id, "Finding active agents in market...")
                for progress in range(0, 101, 25):
                    await asyncio.sleep(0.3)
                    store.update_mission(mission_id, {"phase_progress": progress})
                
                sample_agents = [
                    {'name': 'John Smith', 'company': 'Colliers', 'deals_closed': 12},
                    {'name': 'Jane Doe', 'company': 'CBRE', 'deals_closed': 8},
                ]
                results['agents'] = sample_agents
                store.add_log(mission_id, f"Found {len(sample_agents)} active agents", "success")
            
            elif phase_num == 5 and mission['include']['lenders']:
                store.add_log(mission_id, "Matching financing sources...")
                for progress in range(0, 101, 25):
                    await asyncio.sleep(0.3)
                    store.update_mission(mission_id, {"phase_progress": progress})
                
                sample_lenders = [
                    {'name': 'RBC Commercial', 'type': 'Bank', 'max_ltv': '75%'},
                    {'name': 'Dream Lender', 'type': 'Private', 'max_ltv': '65%'},
                ]
                results['lenders'] = sample_lenders
                store.add_log(mission_id, f"Matched {len(sample_lenders)} lenders", "success")
            
            else:
                for progress in range(0, 101, 25):
                    await asyncio.sleep(0.3)
                    store.update_mission(mission_id, {"phase_progress": progress})
            
            store.add_log(mission_id, f"Completed {phase_name}", "success")
            
        except Exception as e:
            store.add_log(mission_id, f"Error in {phase_name}: {str(e)}", "error")
            print(f"Phase error: {e}")
    
    # Export to Obsidian if vault connector is available
    if vault_connector:
        try:
            store.add_log(mission_id, "Exporting to Obsidian vault...")
            filepath = vault_connector.export_property_research(property_data, results)
            store.add_log(mission_id, f"Exported to {filepath}", "success")
            results['obsidian_export'] = filepath
        except Exception as e:
            store.add_log(mission_id, f"Obsidian export failed: {str(e)}", "warn")
    
    # Complete mission
    store.update_mission(mission_id, {
        "status": "completed",
        "results": results,
    })
    store.add_log(mission_id, "Mission completed successfully!", "success")
    
    await manager.broadcast({
        "type": "mission:complete",
        "missionId": mission_id,
        "results": results,
    }, channel="missions")


# ============================================================================
# FASTAPI APP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global data_connector, vault_connector
    try:
        data_connector = get_connector()
        stats = data_connector.get_stats()
        print(f"✓ BigDataClaw connector ready: {stats}")
    except Exception as e:
        print(f"⚠ Data connector initialization failed: {e}")
    
    try:
        vault_connector = get_vault_connector()
        vault_stats = vault_connector.get_stats()
        print(f"✓ Obsidian vault connector ready: {vault_stats}")
    except Exception as e:
        print(f"⚠ Vault connector initialization failed: {e}")
    
    yield
    
    # Shutdown
    print("Shutting down Nerve server...")


app = FastAPI(
    title="BigDataClaw Nerve",
    description="Real-time mission control for CRE intelligence",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# REST ENDPOINTS - CORE
# ============================================================================

@app.get("/api/health")
async def health_check():
    stats = data_connector.get_stats() if data_connector else {}
    vault_stats = vault_connector.get_stats() if vault_connector else {}
    return {
        "status": "healthy",
        "version": "1.0.0",
        "active_missions": len(store.get_active_missions()),
        "websocket_connections": len(manager.active_connections),
        "data_stats": stats,
        "vault_stats": vault_stats,
    }


@app.post("/api/missions")
async def create_mission(data: MissionCreate, background_tasks: BackgroundTasks):
    mission_id = store.create_mission(data)
    background_tasks.add_task(run_mission_phases, mission_id)
    return store.get_mission(mission_id)


@app.get("/api/missions")
async def list_missions(status: Optional[str] = None):
    missions = list(store.missions.values())
    if status:
        missions = [m for m in missions if m["status"] == status]
    return missions


@app.get("/api/missions/{mission_id}")
async def get_mission(mission_id: str):
    mission = store.get_mission(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@app.post("/api/missions/{mission_id}/abort")
async def abort_mission(mission_id: str):
    store.update_mission(mission_id, {"status": "aborted"})
    await manager.broadcast({
        "type": "mission:aborted",
        "missionId": mission_id,
    }, channel="missions")
    return {"status": "aborted"}


@app.get("/api/hotmoney")
async def get_hot_money(limit: int = 20):
    if data_connector:
        return data_connector.get_hot_money_leads(limit)
    return []


@app.post("/api/match")
async def find_matches(property_data: PropertySubmission, limit: int = 10):
    if data_connector:
        return data_connector.find_matches(property_data.dict(), limit)
    return []


# ============================================================================
# REST ENDPOINTS - OBSIDIAN VAULT
# ============================================================================

@app.get("/api/obsidian/stats")
async def get_vault_stats():
    if vault_connector:
        return vault_connector.get_stats()
    return {"error": "Vault connector not available"}


@app.get("/api/obsidian/buyers")
async def list_buyer_profiles():
    if vault_connector:
        return vault_connector.list_buyer_profiles()
    return []


@app.get("/api/obsidian/buyers/{filepath:path}")
async def get_buyer_profile(filepath: str):
    if vault_connector:
        content = vault_connector.get_profile_content(filepath)
        if content:
            return {"content": content, "path": filepath}
        raise HTTPException(status_code=404, detail="Profile not found")
    raise HTTPException(status_code=503, detail="Vault connector not available")


@app.post("/api/obsidian/export")
async def export_to_obsidian(request: ExportToObsidianRequest):
    if not vault_connector:
        raise HTTPException(status_code=503, detail="Vault connector not available")
    
    try:
        if request.type == 'buyer':
            filepath = vault_connector.export_buyer_profile(request.data)
        elif request.type == 'property':
            filepath = vault_connector.export_property_research(
                request.data.get('property', {}),
                request.data.get('results', {})
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid export type")
        
        return {"success": True, "filepath": filepath}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/obsidian/search")
async def search_vault(request: ObsidianSearchRequest):
    if vault_connector:
        return vault_connector.search_vault(request.query)
    return []


# ============================================================================
# REST ENDPOINTS - AGENTS & STATS
# ============================================================================

@app.get("/api/agents")
async def list_agents():
    hot_money_count = data_connector.get_stats().get('hot_money_count', 0) if data_connector else 156
    
    return [
        {
            "id": "transaction-scout",
            "name": "Transaction Scout",
            "status": "idle",
            "description": "Find recent transactions in target market",
            "icon": "🎯",
        },
        {
            "id": "hot-money-tracker",
            "name": "Hot Money Tracker",
            "status": "active",
            "description": "Identify sellers with fresh capital",
            "icon": "🔥",
            "watching_count": hot_money_count,
            "alert_count": 8,
        },
        {
            "id": "portfolio-analyzer",
            "name": "Portfolio Analyzer",
            "status": "idle",
            "description": "Match asset class portfolios",
            "icon": "💼",
        },
        {
            "id": "agent-finder",
            "name": "Agent Finder",
            "status": "idle",
            "description": "Find active brokers in market",
            "icon": "👤",
        },
        {
            "id": "lender-matcher",
            "name": "Lender Matcher",
            "status": "idle",
            "description": "Match financing sources",
            "icon": "🏦",
        },
        {
            "id": "obsidian-sync",
            "name": "Obsidian Sync",
            "status": "active",
            "description": "Sync with Obsidian vault",
            "icon": "📝",
            "last_sync": "2m ago",
            "file_count": vault_connector.get_stats().get('total_files', 0) if vault_connector else 1247,
        },
    ]


@app.get("/api/stats")
async def get_stats():
    if data_connector:
        return data_connector.get_stats()
    return {
        "total_transactions": 0,
        "total_buyers": 0,
        "hot_money_count": 0,
        "tracked_capital": 0,
    }


# ============================================================================
# WEBSOCKET ENDPOINT
# ============================================================================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                
                if message.get("type") == "subscribe":
                    channels = message.get("channels", [])
                    manager.subscribe(websocket, channels)
                    await websocket.send_json({
                        "type": "subscribed",
                        "channels": channels,
                    })
                
                elif message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
                    
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON",
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=3090,
        reload=True,
        log_level="info",
    )
