import { useState } from "react";
import { HeartIcon, SpinnerIcon } from "./icons";

export default function App() {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (loading) return;

    const action = liked ? "unlike" : "like";

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://questions.greatfrontend.com/api/questions/like-button",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setLiked(!liked);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    backgroundColor: liked ? "#f00" : "#fff",
    color: liked ? "#fff" : hovered ? "#f00" : "#888",
    borderColor: liked ? "#f00" : hovered ? "#f00" : "#888",
  };

  return (
    <div style={{ width: "5rem" }}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={loading}
        aria-pressed={liked}
        style={styles}
      >
        {loading ? <SpinnerIcon /> : <HeartIcon className="lg" />}
        Like
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
