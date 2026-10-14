type Video = {
  views: number;
  rank?: number;
};

function videoRanking(videos: Video[]): Video[] {
  const sortedVideos = videos.map((video, index) => ({
    ...video,
    originalIndex: index
  }));

  sortedVideos.sort((a, b) => b.views - a.views);

  sortedVideos.forEach((video, i) => {
    video.rank = i + 1;
  });

  sortedVideos.sort((a, b) => a.originalIndex - b.originalIndex);

  return sortedVideos.map(({ views, rank }) => ({
    views,
    rank
  }));
}
