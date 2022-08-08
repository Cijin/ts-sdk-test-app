import * as React from "react";
import {
  createQuery,
  runQuery,
  createComment,
  connectClient,
  enableCache,
  createClient,
  subscribeTopic,
  getPostTopic,
  observePost,
  observeComments,
} from "@amityco/ts-sdk";

import "./App.css";

const referenceType = "post";
const referenceId = "62e8f70ac4daed00d90209fb";
const text = "example post";

const apiKey = "b3bee858328ef4344a308e4a5a091688d05fdee2be353a2b";
const apiRegion = "staging";
const session = { userId: "test" };
const path =
  "5b028e4a673f81000fb040e7/social/user/5d2f0001369828e7a92bfab6/post/62e8f70ac4daed00d90209fb";

function App() {
  const [connected, setConnected] = React.useState(false);
  const [comment, setComment] = React.useState({});
  const [client, setClient] = React.useState({});

  /*
   * Connect Client
   */
  const connect = async () => {
    setClient(createClient(apiKey, apiRegion));
    // @ts-ignore
    window.amityClient = client;

    try {
      await connectClient(session);
      setConnected(true);
      enableCache();
      return { success: true };
    } catch (e) {
      setConnected(false);
    }
  };

  // create new comment
  const newComment = () => {
    // @ts-ignore
    const query = createQuery(createComment, {
      referenceId,
      referenceType,
      data: { text },
    });
    runQuery(query, (data) => setComment(data));
  };

  // subscribe to post
  const subscribe = () => {
    observePost(referenceId, {
      onFetch: subscribeTopic(
        // @ts-ignore
        getPostTopic({ path }, "comment")
      ),
      onEvent: (params) => console.log(params),
    });
  };

  const subscribeComment = () => {
    observeComments(referenceId, {
      onEvent: console.log,
    });
  };

  // @ts-ignore
  const printCache = () => console.log(client.cache);

  return (
    <div className="App">
      <section>
        <h3>Connected: {String(connected)}</h3>
        <button onClick={connect}>Connect</button>
        <hr />

        <button onClick={newComment}>Create Comment</button>
        <pre>{JSON.stringify(comment, null, 2)}</pre>
      </section>
      <hr />

      <section>
        <button onClick={subscribe}>Subscibe to Post-Comment</button>
        <button onClick={printCache}>Print Cache</button>
      </section>
    </div>
  );
}

export default App;
