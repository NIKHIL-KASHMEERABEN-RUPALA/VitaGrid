"""
VitaGrid GOV - Sovereign Relational Schemas
Maps facilities, multi-echelon stock levels, IoT sensor logs, and cryptographic action dockets.
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
import time
from vitagrid_gov.db.session import Base


class FacilityModel(Base):
    __tablename__ = "facilities"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    county_code = Column(String(16), index=True, nullable=False)
    echelon = Column(String(32), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    total_acute_beds = Column(Integer, default=50)
    occupied_acute_beds = Column(Integer, default=0)
    icu_ventilators = Column(Integer, default=4)
    active_clinicians = Column(Integer, default=12)
    created_at = Column(Float, default=time.time)


class InventoryModel(Base):
    __tablename__ = "inventory"

    id = Column(String(64), primary_key=True, index=True)
    facility_id = Column(String(64), ForeignKey("facilities.id"), index=True, nullable=False)
    commodity_code = Column(String(64), index=True, nullable=False)
    commodity_name = Column(String(255), nullable=False)
    units_on_hand = Column(Integer, default=0)
    batch_lot_number = Column(String(64), nullable=True)
    expiry_timestamp = Column(Float, nullable=True)
    daily_consumption = Column(Float, default=10.0)


class ColdChainReadingModel(Base):
    __tablename__ = "cold_chain_readings"

    id = Column(String(64), primary_key=True, index=True)
    sensor_id = Column(String(64), index=True, nullable=False)
    facility_id = Column(String(64), index=True, nullable=False)
    temperature_celsius = Column(Float, nullable=False)
    ambient_celsius = Column(Float, nullable=True)
    battery_pct = Column(Float, default=100.0)
    compressor_strain = Column(Float, default=0.2)
    timestamp = Column(Float, default=time.time, index=True)


class ActionDocketModel(Base):
    __tablename__ = "action_dockets"

    docket_id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    action_type = Column(String(64), index=True, nullable=False)
    originating_agent = Column(String(64), nullable=False)
    state = Column(String(32), default="PENDING_AUTHORIZATION", index=True)
    payload_json = Column(JSON, nullable=False)
    authorizer_id = Column(String(64), nullable=True)
    signature = Column(String(255), nullable=True)
    rollback_token = Column(String(255), nullable=True)
    created_at = Column(Float, default=time.time)
    authorized_at = Column(Float, nullable=True)
