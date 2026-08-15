"use client";

import { useState } from "react";

const API_URL =
  "https://video-downloader-api-8akj.onrender.com/api/download";

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function downloadVideo() {
    if (!url.trim()) {
      setMessage("Tafadhali weka video link.");
      setDownloadUrl("");
      return;
    }

    setLoading(true);
    setMessage("Inaandaa video...");
    setDownloadUrl("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data.message ||
            "Imeshindikana kupakua video hii."
        );
      }

      setMessage(
        data.title
          ? `Video iko tayari: ${data.title}`
          : "Video iko tayari kupakuliwa."
      );

      setDownloadUrl(data.download_url);
    } catch (error) {
      setDownloadUrl("");

      setMessage(
        error instanceof Error
          ? error.message
          : "Imeshindikana kuwasiliana na server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl text-white">
            ↓
          </div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Video Downloader
          </h1>

          <p className="mt-3 text-gray-500">
            Pakua video kwa kuweka link hapa chini
          </p>
        </div>

        <div className="mt-8">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                downloadVideo();
              }
            }}
            placeholder="https://youtube.com/..."
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-900 outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-gray-200"
          />

          <button
            type="button"
            onClick={downloadVideo}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-black p-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Inaandaa..." : "Download Video"}
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-gray-100 p-5">
            <p className="break-words text-sm text-gray-700">
              {message}
            </p>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl bg-black p-3 text-center font-semibold text-white transition hover:bg-gray-800"
              >
                Pakua Video
              </a>
            )}
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-center text-lg font-bold text-gray-900">
            Supported Platforms
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {["YouTube", "TikTok", "Instagram", "Facebook"].map(
              (platform) => (
                <div
                  key={platform}
                  className="rounded-xl bg-gray-100 p-4 text-center font-medium text-gray-800"
                >
                  {platform}
                </div>
              )
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Tumia video ambazo una ruhusa ya ku-download.
        </p>
      </div>
    </main>
  );
}