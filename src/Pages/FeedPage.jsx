import React, { useEffect, useState } from 'react'
import { getAllPosts } from '../service/Post.service';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedCard from './FeedCard';

const FeedPage = () => {
  const [feedData, setFeedData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const getFeedDataFn = async (limit, page) => {
    try {
      const data = await getAllPosts(limit, page);
      console.log({ data })
      setTotalCount(data.totalPosts);
      setFeedData((prevData) => [...prevData, ...data.posts]);
    } catch (error) {
      console.log("Error while fetching feed data:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    getFeedDataFn(20,page)
  }, [])

  return (
    <div
      id="scrollableDiv"
      style={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/*Put the scroll bar always on the bottom*/}
      <InfiniteScroll
        dataLength={feedData.length}
        next={() => {
          setPage(page+1);
          getFeedDataFn(20, page + 1);
        }}
        style={{ display: 'flex', flexDirection: 'column' }} //To put endMessage and loader to the top.
        hasMore={totalCount !== feedData.length}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {feedData.map((post, index) => (
          <FeedCard key={index} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default FeedPage