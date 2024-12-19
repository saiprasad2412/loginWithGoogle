import React, { useEffect, useState } from 'react'
import { getAllPosts, handleLikeFn } from '../service/Post.service';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedCard from './FeedCard';

const FeedPage = () => {
  const [feedData, setFeedData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loggedInUserId,setLoggedInUserId]=useState(null);
  const [onupdateFlag,setOnupdateFlag]=useState(false);


  const getFeedDataFn = async (limit, page) => {
    try {
      const data = await getAllPosts(limit, page);
      setTotalCount(data.totalPosts);
      setFeedData((prevData) => [...prevData, ...data.posts]);

      const res=JSON.parse(localStorage.getItem('user'));
    setLoggedInUserId(res._id);
    } catch (error) {
      console.log("Error while fetching feed data:", error);
      setHasMore(false);
    }
  };
  const handleLike = async (postId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;
  
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      const response = await handleLikeFn(postId, userId);
    } catch (error) {
      console.error("Error while liking the post:", error);
    }
  };
  
  

  useEffect(() => {
    getFeedDataFn(20,page);
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
      <InfiniteScroll
        dataLength={feedData.length}
        next={() => {
          setPage(page+1);
          getFeedDataFn(20, page + 1);
        }}
        style={{ display: 'flex', flexDirection: 'column' }} 
        hasMore={totalCount !== feedData.length}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {feedData.map((post, index) => (
          

            <FeedCard key={index} post={post} handleLike={handleLike} loggedInUserId={loggedInUserId} getFeedDataFn={getFeedDataFn} onupdateFlag={onupdateFlag} setOnupdateFlag={setOnupdateFlag}/>
          
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default FeedPage