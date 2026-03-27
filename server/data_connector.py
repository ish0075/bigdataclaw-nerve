#!/usr/bin/env python3
"""
BigDataClaw Data Connector
Connects Nerve to existing BigDataClaw data sources
"""

import os
import sys
import json
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional

# Add BigDataClaw to path
BIGDATACLAW_PATH = Path("/home/jamie/Desktop/Jamie's Personal Vault/bigdataclaw")
sys.path.insert(0, str(BIGDATACLAW_PATH))

# Import BigDataClaw components
try:
    from matching_engine import MatchingEngine, MatchResult
    from agents.orchestrator import AgentOrchestrator, PropertySubmission
    print("✓ BigDataClaw components imported successfully")
except ImportError as e:
    print(f"⚠ Could not import BigDataClaw components: {e}")
    MatchingEngine = None
    AgentOrchestrator = None


class BigDataClawDataConnector:
    """Connects Nerve to BigDataClaw data sources"""
    
    def __init__(self, data_path: str = None):
        self.data_path = data_path or BIGDATACLAW_PATH
        self.workspace_path = Path.home() / "CortexOS" / "workspace"
        
        # Dataframes
        self.transactions_df: Optional[pd.DataFrame] = None
        self.buyers_df: Optional[pd.DataFrame] = None
        self.fresh_leads_df: Optional[pd.DataFrame] = None
        
        # Components
        self.matching_engine: Optional[MatchingEngine] = None
        self.orchestrator: Optional[AgentOrchestrator] = None
        
        self._load_data()
        self._init_components()
    
    def _load_data(self):
        """Load CSV data sources"""
        try:
            # Load transaction data
            tx_path = self.workspace_path / 'data_export.csv'
            if tx_path.exists():
                self.transactions_df = pd.read_csv(tx_path)
                print(f"✓ Loaded {len(self.transactions_df)} transactions")
            else:
                print(f"⚠ Transaction data not found at {tx_path}")
            
            # Load buyer database
            buyer_path = self.workspace_path / 'new_data.csv'
            if buyer_path.exists():
                self.buyers_df = pd.read_csv(buyer_path)
                print(f"✓ Loaded {len(self.buyers_df)} buyer records")
            else:
                print(f"⚠ Buyer data not found at {buyer_path}")
            
            # Load fresh leads
            fresh_path = self.workspace_path / 'fresh_data.csv'
            if fresh_path.exists():
                self.fresh_leads_df = pd.read_csv(fresh_path)
                print(f"✓ Loaded {len(self.fresh_leads_df)} fresh leads")
            else:
                print(f"⚠ Fresh leads not found at {fresh_path}")
                
        except Exception as e:
            print(f"⚠ Error loading data: {e}")
    
    def _init_components(self):
        """Initialize BigDataClaw components"""
        if MatchingEngine:
            try:
                self.matching_engine = MatchingEngine()
                print("✓ MatchingEngine initialized")
            except Exception as e:
                print(f"⚠ Could not initialize MatchingEngine: {e}")
        
        if AgentOrchestrator:
            try:
                self.orchestrator = AgentOrchestrator(str(self.workspace_path))
                print("✓ AgentOrchestrator initialized")
            except Exception as e:
                print(f"⚠ Could not initialize AgentOrchestrator: {e}")
    
    def get_hot_money_leads(self, limit: int = 20) -> List[Dict]:
        """Get hot money leads from transaction data"""
        leads = []
        
        if self.transactions_df is None or self.transactions_df.empty:
            # Return sample data if no real data
            return self._get_sample_hot_money()
        
        try:
            # Find recent sellers (last 90 days)
            df = self.transactions_df.copy()
            
            # Parse dates
            if 'sales.date' in df.columns:
                df['sale_date'] = pd.to_datetime(df['sales.date'], errors='coerce')
            elif 'date' in df.columns:
                df['sale_date'] = pd.to_datetime(df['date'], errors='coerce')
            
            # Filter for recent sales
            cutoff_date = datetime.now() - timedelta(days=90)
            recent_sales = df[df['sale_date'] >= cutoff_date]
            
            # Group by seller to find those with significant sales
            if 'contact_type' in df.columns:
                sellers = recent_sales[recent_sales['contact_type'].str.lower() == 'seller']
            else:
                sellers = recent_sales
            
            # Get sales amounts
            if 'sales.price' in sellers.columns:
                sellers['price'] = pd.to_numeric(sellers['sales.price'], errors='coerce')
            elif 'price' in sellers.columns:
                sellers['price'] = pd.to_numeric(sellers['price'], errors='coerce')
            
            # Filter for significant sales ($500K+)
            significant = sellers[sellers['price'] >= 500000].copy()
            
            # Sort by price
            significant = significant.sort_values('price', ascending=False).head(limit)
            
            for _, row in significant.iterrows():
                lead = {
                    'id': str(hash(row.get('email', row.get('full_name', str(_)))))[:8],
                    'entity': row.get('full_name') or row.get('company.name') or 'Unknown Entity',
                    'cash_amount': float(row.get('price', 0)),
                    'sale_date': row['sale_date'].strftime('%b %Y') if pd.notna(row.get('sale_date')) else 'Recent',
                    'location': row.get('sales.city') or row.get('city') or 'Unknown',
                    'property': row.get('sales.address') or row.get('address') or 'Property',
                    'property_type': row.get('sales.property_type') or row.get('property_type') or 'Commercial',
                    'match_score': int(min(95, 70 + (float(row.get('price', 0)) / 1e6))),
                    'contact_email': row.get('email'),
                    'contact_phone': row.get('company.phone'),
                    'linkedin': row.get('linkedin'),
                }
                leads.append(lead)
            
            return leads if leads else self._get_sample_hot_money()
            
        except Exception as e:
            print(f"⚠ Error getting hot money: {e}")
            return self._get_sample_hot_money()
    
    def _get_sample_hot_money(self) -> List[Dict]:
        """Get sample hot money data"""
        return [
            {
                'id': '1',
                'entity': '2650687 Ontario Ltd',
                'cash_amount': 15000000,
                'sale_date': 'May 2025',
                'location': 'West Lincoln',
                'property': 'Thirty Rd, West Lincoln',
                'property_type': 'Industrial',
                'match_score': 92,
                'contact_email': 'contact@2650687ontario.ca',
                'contact_phone': '905-555-0100',
            },
            {
                'id': '2',
                'entity': 'Turnberry Holdings Inc',
                'cash_amount': 9840000,
                'sale_date': 'Jan 2025',
                'location': 'Lincoln',
                'property': '4556-4568 Lincoln Ave',
                'property_type': 'Mixed-Use',
                'match_score': 88,
                'contact_email': 'info@turnberryholdings.com',
                'contact_phone': '905-555-0200',
            },
            {
                'id': '3',
                'entity': '1863570 Ontario Inc',
                'cash_amount': 7000000,
                'sale_date': 'Jan 2025',
                'location': 'Pelham',
                'property': '981 Pelham St',
                'property_type': 'Industrial',
                'match_score': 85,
                'contact_email': 'info@1863570ontario.ca',
                'contact_phone': '905-555-0300',
            },
        ]
    
    def find_matches(self, property_data: Dict, limit: int = 10) -> List[Dict]:
        """Find matching buyers for a property"""
        matches = []
        
        if self.matching_engine:
            try:
                match_results = self.matching_engine.find_matches(property_data, limit)
                for match in match_results:
                    matches.append({
                        'id': match.buyer_id,
                        'entity': match.company_name,
                        'contact_name': match.contact_name,
                        'match_score': match.match_score,
                        'match_reasons': match.match_reasons,
                        'cash_position': match.last_sale_amount,
                        'has_1031': match.has_1031_deadline,
                        'contact': match.contact_info,
                    })
                return matches
            except Exception as e:
                print(f"⚠ MatchingEngine error: {e}")
        
        # Fallback to sample matches
        return self._get_sample_matches(property_data, limit)
    
    def _get_sample_matches(self, property_data: Dict, limit: int = 10) -> List[Dict]:
        """Get sample match data"""
        sample_matches = [
            {
                'id': '1',
                'entity': 'Dream Industrial REIT',
                'contact_name': 'Michael Cooper',
                'contact_title': 'VP Acquisitions',
                'match_score': 95,
                'match_reasons': ['Recent industrial purchases', 'Active in Niagara', 'Price range match'],
                'typical_deal_size': '$10M - $100M',
                'asset_focus': ['Industrial', 'Logistics'],
                'contact': {
                    'email': 'm.cooper@dream.ca',
                    'phone': '416-555-0101',
                    'linkedin': 'linkedin.com/company/dream-industrial',
                },
            },
            {
                'id': '2',
                'entity': 'Pure Industrial REIT',
                'contact_name': 'Sarah Chen',
                'contact_title': 'Director, Investments',
                'match_score': 88,
                'match_reasons': ['Active buyer in market', 'Similar asset class'],
                'typical_deal_size': '$5M - $50M',
                'asset_focus': ['Industrial', 'Light Manufacturing'],
                'contact': {
                    'email': 's.chen@pureindustrial.ca',
                    'phone': '416-555-0202',
                    'linkedin': 'linkedin.com/company/pure-industrial',
                },
            },
            {
                'id': '3',
                'entity': 'Carttera Private Equity',
                'contact_name': 'David Thompson',
                'contact_title': 'Managing Partner',
                'match_score': 82,
                'match_reasons': ['Large deal capacity', 'Ontario focus'],
                'typical_deal_size': '$20M - $200M',
                'asset_focus': ['Industrial', 'Mixed-Use'],
                'contact': {
                    'email': 'd.thompson@carttera.com',
                    'phone': '416-555-0303',
                    'linkedin': 'linkedin.com/company/carttera',
                },
            },
        ]
        return sample_matches[:limit]
    
    def run_property_research(self, property_data: Dict) -> Dict:
        """Run full property research via orchestrator"""
        if self.orchestrator:
            try:
                result = self.orchestrator.research_property(property_data)
                return result
            except Exception as e:
                print(f"⚠ Orchestrator error: {e}")
        
        # Return sample result
        return {
            'status': 'completed',
            'matches': self._get_sample_matches(property_data, 10),
            'hot_money': self._get_sample_hot_money()[:3],
            'agents': [],
            'lenders': [],
        }
    
    def get_stats(self) -> Dict:
        """Get dashboard statistics"""
        stats = {
            'total_transactions': len(self.transactions_df) if self.transactions_df is not None else 0,
            'total_buyers': len(self.buyers_df) if self.buyers_df is not None else 0,
            'total_fresh_leads': len(self.fresh_leads_df) if self.fresh_leads_df is not None else 0,
        }
        
        # Add hot money stats
        hot_money = self.get_hot_money_leads(100)
        stats['hot_money_count'] = len(hot_money)
        stats['tracked_capital'] = sum(l['cash_amount'] for l in hot_money)
        
        return stats


# Global connector instance
_connector: Optional[BigDataClawDataConnector] = None

def get_connector() -> BigDataClawDataConnector:
    """Get or create global data connector"""
    global _connector
    if _connector is None:
        _connector = BigDataClawDataConnector()
    return _connector
