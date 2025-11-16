from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String)
    seller = Column(String, index=True)
    meeting_date = Column(Date, index=True)
    closed = Column(Boolean, default=False)
    transcript = Column(String)

    category = relationship("ClientCategory", back_populates="client", uselist=False)


class ClientCategory(Base):
    __tablename__ = "client_categories"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), unique=True)

    industry = Column(String, index=True)
    company_size = Column(String)
    main_pain = Column(String)
    contact_volume_level = Column(String)
    contact_volume_numeric = Column(Integer, nullable=True)
    has_peaks = Column(Boolean)
    peak_context = Column(String, nullable=True)
    discovery_channel = Column(String)
    main_value_perceived = Column(String)
    urgency_level = Column(String)
    deal_stage_inferred = Column(String)

    client = relationship("Client", back_populates="category")
