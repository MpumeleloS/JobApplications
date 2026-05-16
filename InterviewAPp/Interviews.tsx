import React, { useState } from "react";

type Interview = {
  id: number;
  jobTitle: string;
  companyName: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
  location: string;
  notes: string;
};

export default function Interviews() {
  const [search, setSearch] = useState("");

  const [interviews] = useState<Interview[]>([
    {
      id: 1,
      jobTitle: "Software Developer",
      companyName: "Amazon",
      date: "20 May 2026",
      time: "10:00 AM",
      type: "Video Interview",
      interviewer: "John Smith",
      location: "Zoom Meeting",
      notes:
        "Research company background, review job description, prepare key talking points."
    },
    {
      id: 2,
      jobTitle: "UI/UX Designer",
      companyName: "Google",
      date: "22 May 2026",
      time: "2:00 PM",
      type: "Technical Interview",
      interviewer: "Sarah Johnson",
      location: "Google Meet",
      notes:
        "Prepare portfolio presentation and review design principles."
    }
  ]);

  const filteredInterviews = interviews.filter(
    (item) =>
      item.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.interviewer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        padding: "25px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        <h1
          style={{
            color: "#1565c0",
            fontSize: "36px",
            marginBottom: "5px"
          }}
        >
          Interview Scheduled
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px"
          }}
        >
          Schedule and manage your interviews
        </p>

        <input
          type="text"
          placeholder="Search interviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "25px",
            fontSize: "16px"
          }}
        />

        {filteredInterviews.map((interview) => (
          <div
            key={interview.id}
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.1)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap"
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#222"
                  }}
                >
                  {interview.jobTitle}
                </h2>

                <p
                  style={{
                    color: "#666"
                  }}
                >
                  {interview.companyName}
                </p>
              </div>

              <span
                style={{
                  background: "#d6eaff",
                  color: "#1565c0",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  height: "fit-content"
                }}
              >
                Upcoming
              </span>
            </div>

            <hr />

            <p>
              📅 <strong>Date:</strong> {interview.date}
            </p>

            <p>
              ⏰ <strong>Time:</strong> {interview.time}
            </p>

            <p>
              🎥 <strong>Type:</strong> {interview.type}
            </p>

            <p>
              👤 <strong>Interviewer:</strong> {interview.interviewer}
            </p>

            <p>
              📍 <strong>Location:</strong> {interview.location}
            </p>

            <div
              style={{
                marginTop: "20px",
                background: "#eef5ff",
                padding: "15px",
                borderRadius: "10px"
              }}
            >
              <h3
                style={{
                  color: "#1565c0"
                }}
              >
                Preparation Notes
              </h3>

              <p>{interview.notes}</p>
            </div>

            <button
              style={{
                marginTop: "20px",
                background: "#1565c0",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Join Interview
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}