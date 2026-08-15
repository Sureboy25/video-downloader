from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import yt_dlp
import os

from fastapi.staticfiles import StaticFiles

from database import SessionLocal, Base, engine
from models import Download


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(title="Video Downloader API")


# Downloads folder
DOWNLOAD_FOLDER = "downloads"

os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)


# Serve downloaded files
app.mount(
    "/downloads",
    StaticFiles(directory=DOWNLOAD_FOLDER),
    name="downloads"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://sureboy25.github.io",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoRequest(BaseModel):
    url: str


@app.get("/")
def home():
    return {
        "message": "Video Downloader API is running"
    }


@app.post("/api/download")
def download_video(
    data: VideoRequest,
    request: Request
):

    url = data.url.strip()

    if not url:
        return {
            "status": "error",
            "message": "Video URL haijawekwa"
        }


    options = {
    "format": "best",
    "outtmpl": f"{DOWNLOAD_FOLDER}/%(title)s.%(ext)s",
    "quiet": True,
    "noplaylist": True,
    "http_headers": {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/138.0.0.0 Safari/537.36"
        )
    },
    "extractor_args": {
        "youtube": {
            "player_client": ["android"]
        }
    }
}


    try:

        # Download video
        with yt_dlp.YoutubeDL(options) as ydl:

            info = ydl.extract_info(
                url,
                download=True
            )

            filename = ydl.prepare_filename(info)


        # File name
        filename_only = os.path.basename(filename)


        # URL ya file
        download_url = str(
            request.base_url
        ).rstrip("/") + "/downloads/" + filename_only


        # Save information in PostgreSQL
        db = SessionLocal()

        try:

            download = Download(
                title=info.get("title") or "Unknown",
                url=url,
                download_url=download_url,
                status="completed"
            )

            db.add(download)
            db.commit()
            db.refresh(download)

        finally:

            db.close()


        return {
            "status": "success",
            "title": info.get("title"),
            "message": "Video imeshushwa na taarifa imehifadhiwa",
            "download_url": download_url,
            "download_id": download.id
        }


    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }
