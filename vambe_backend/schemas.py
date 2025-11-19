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
    use_case: str
    main_pain: str
    weekly_volume: Optional[int] = None
    origin_channel: str
    purchase_trigger: str
    urgency: str
    interest_level: str
    sales_stage: str
    monetary_opportunity: str
    requires_integration: str
    complexity: str

class ClientCategory(ClientCategoryBase):
    id: int
    client_id: int
    class Config:
        from_attributes = True


class ClientFull(Client):
    category: Optional[ClientCategory] = None

    class Config:
        from_attributes = True

