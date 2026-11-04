import { useState, useEffect } from "react";
const PAGE_SIZE = 5;
const BASE_URL = "https://hacker-news.firebaseio.com/v0";
type T_details = {
  id: number;
  by: string;
  title: string;
  url: string;
  type: string;
  time: number;
  score: number;
};
export default function App() {
  const [news, setNews] = useState<Array<number>>([]);
  const [details, setDetails] = useState<T_details[]>([]);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetchNews(controller);
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!news || news.length === 0) return;
    fetchDetails();
  }, [news, page]);

  async function fetchNews(controller: AbortController) {
    try {
      const res = await fetch(`${BASE_URL}/jobstories.json`, {
        signal: controller.signal,
      });
      const data = await res.json();
      console.log(data);
      setNews(data);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.log(e);
      }
    }
  }
  async function fetchDetails() {
    const detailsArr = await Promise.all(
      news
        .slice(page * 5, page * 5 + 5)
        .map((id) =>
          fetch(`${BASE_URL}/item/${id}.json`).then((res) => res.json()),
        ),
    );
    setDetails((prev) => prev.concat(detailsArr));
  }
  if (!details || details.length == 0) return <>loading</>;
  return (
    <div className="app">
      <h1 className="title">Hacker News Jobs Board</h1>
      {news == null ? (
        <p className="loading">Loading...</p>
      ) : (
        <div>
          <div className="jobs" role="list">
            {details.map((job) => (
              <JobPosting key={job.id} {...job} />
            ))}
          </div>
          {details.length > 0 && details.length < news.length && (
            <button
              className="load-more-button"
              // disabled={fetchingJobDetails}
              onClick={() => setPage(page + 1)}
            >
              {"Load more jobs"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
function JobPosting({ url, by, time, title }: Readonly<T_details>) {
  return (
    <div className="post" role="listitem">
      <h2 className="post__title">
        {url ? (
          <a href={url} target="_blank" rel="noopener">
            {title}
          </a>
        ) : (
          title
        )}
      </h2>
      <p className="post__metadata">
        By {by} &middot; {new Date(time * 1000).toLocaleString()}
      </p>
    </div>
  );
}
