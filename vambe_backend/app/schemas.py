from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    seller: str
    meeting_date: date
    closed: bool
    transcript: str

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    class Config:
        from_attributes = True


class ClientCategoryBase(BaseModel):
    industry: str
    company_size: str
    main_pain: str
    contact_volume_level: str
    contact_volume_numeric: Optional[int]
    has_peaks: bool
    peak_context: Optional[str]
    discovery_channel: str
    main_value_perceived: str
    urgency_level: str
    deal_stage_inferred: str

class ClientCategory(ClientCategoryBase):
    id: int
    client_id: int
    class Config:
        from_attributes = True
