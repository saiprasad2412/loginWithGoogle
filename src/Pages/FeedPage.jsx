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
      console.log({ data })
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
  
      // Await the response from the like API
      const response = await handleLikeFn(postId, userId);
      console.log("Like response:", response);
  
      // Update the feedData state to reflect the new likes count
      setFeedData((prevData) =>
        prevData.map((post) =>
          post._id === postId
            ? { ...post, likes: response.likes } // Update likes array
            : post
        )
      );
    } catch (error) {
      console.error("Error while liking the post:", error);
    }
  };
  

  useEffect(() => {
    getFeedDataFn(20,page);
  }, [])
  useEffect(() => {
    getFeedDataFn(20,page);
  }, [onupdateFlag])

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
          

            <FeedCard key={index} post={post} handleLike={handleLike} loggedInUserId={loggedInUserId} getFeedDataFn={getFeedDataFn} onupdateFlag={onupdateFlag} setOnupdateFlag={setOnupdateFlag}/>
          
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default FeedPage