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

    industry = Column(String)                        
    use_case = Column(String)           
    main_pain = Column(String)                    
    weekly_volume = Column(Integer, nullable=True)           
    origin_channel = Column(String)               
    purchase_trigger = Column(String)             
    urgency = Column(String)                      
    interest_level = Column(String)                   
    sales_stage = Column(String)                 
    monetary_opportunity = Column(String)       
    requires_integration = Column(String)           
    complexity = Column(String)                    

    client = relationship("Client", back_populates="category")