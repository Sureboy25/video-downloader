from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from database import Base


class Download(Base):
    __tablename__ = "downloads"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    url = Column(String, nullable=False)

    download_url = Column(String, nullable=True)

    status = Column(String, default="completed")

    created_at = Column(DateTime, default=datetime.utcnow)
