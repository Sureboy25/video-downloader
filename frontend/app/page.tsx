"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  async function downloadVideo() {
    if (!url.trim()) {
      setMessage("Tafadhali weka video link");
      return;
    }

    setLoading(true);
    setMessage("Inaandaa download...");
    setDownloadUrl("");

    try {
      const response = await fetch(
        "https://video-downloader-api-8akj.onrender.com/api/download",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setMessage(`${data.title} - ${data.message}`);
        setDownloadUrl(data.download_url);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Imeshindikana kuwasiliana na server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
        <h1 className="text-4xl font-bold text-center">
          Video Downloader
        </h1>

        <p className="text-gray-500 text-center mt-3 mb-8">
          Paste link ya video yako hapa
        </p>

        <input
          type="text"
          placeholder="https://youtube.com/..."
          className="w-full border p-4 rounded-xl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={downloadVideo}
          disabled={loading}
          className="w-full bg-black text-white mt-4 p-4 rounded-xl hover:bg-gray-800 disabled:bg-gray-500"
        >
          {loading ? "Downloading..." : "Download"}
        </button>

        {message && (
          <div className="mt-6 bg-gray-100 p-4 rounded-xl">
            <p>{message}</p>

            {downloadUrl && (
              <a
                href={downloadUrl}
                className="block text-center bg-black text-white mt-4 p-3 rounded-xl"
              >
                Download Video
              </a>
            )}
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-bold mb-3">
            Supported Platforms
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              YouTube
            </div>

            <div className="bg-gray-100 p-3 rounded-lg text-center">
              TikTok
            </div>

            <div className="bg-gray-100 p-3 rounded-lg text-center">
              Instagram
            </div>

            <div className="bg-gray-100 p-3 rounded-lg text-center">
              Facebook
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}