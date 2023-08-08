import React, { useState, useEffect, useCallback } from "react";
import fetchRepoIssues from "./utils/fetchIssues";
import toast from "react-hot-toast";

const GitRepoIssues = () => {
  // Variables
  const [url, setUrl] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [issues, setIssues] = useState([]);
  const [token, setToken] = useState("");
  const [expandedIssueId, setExpandedIssueId] = useState({});

  // handle github url change
  const handleUrlChange = (e) => {
    debugger;
    setUrl(e.target.value);
  };

  const handleTokenChange = (e) => {
    debugger;

    setToken(e.target.value);
  };
  // add token to local storage
  const saveToken = () => {
    debugger;
    localStorage.setItem("token", token);
    setToken("");
  };

  const clearIssues = () => {
    // Clear the 'issues state and remove the cached issues from localStorage
    setIssues([]);
    localStorage.removeItem("cachedIssues");
    localStorage.removeItem("time");
  };

  const handleFetchSubmit = () => {
    // Fetch issues based on the GitHub repository URL entered
    // and update the 'issues state with the data
    fetchRepoIssues(url).then((res) => {
      setIssues(res.data);
      localStorage.setItem("cachedIssues", JSON.stringify(res.data));
    });
  };


  // onclick of id set the expanded issue id
  const toggleIssueBody = (issueId) => {
    setExpandedIssueId((prevId) => (prevId === issueId ? null : issueId));
  };

  useEffect(() => {
    const cachedToken = localStorage.getItem("token");
    if (cachedToken !== null) {
      setToken(cachedToken);
      setDisabled(false);
    }

    const cachedIssues = localStorage.getItem("cachedIssues");
    const cachedTime = localStorage.getItem("time");
    const currentTime = new Date().getTime();
    debugger
    if (cachedIssues !== null && cachedTime !== null && currentTime - cachedTime < 300000) {
      debugger
      setIssues(JSON.parse(cachedIssues));
    } else {
      localStorage.setItem("time", currentTime);
      fetchRepoIssues(url).then((res) => {
        setIssues(res.data);
        localStorage.setItem("cachedIssues", JSON.stringify(res.data));
      });
    }
  }, [disabled, token]);

  return (
    <div>
      <h1>GitHub Repo Issues</h1>
      <div className="buttons">
        <div>
          <label htmlFor="url">
            Repository URL (FORMAT : https://github.com/OWNER/REPO/)
          </label>
          <br />
          <input
            type="text"
            placeholder="Enter GitHub repository URL...."
            value={url}
            onChange={handleUrlChange}
          />
        </div>

        <button disabled={disabled} onClick={handleFetchSubmit}>
          {disabled
            ? "Fetch Issues - Disabled Set token first"
            : "Fetch Issues"}
        </button>
        <button onClick={clearIssues}>Clear Issues</button>

        <div>
          <label htmlFor="token">Token</label>
          <input
            type="password"
            placeholder="Enter GitHub token"
            value={token}
            onChange={handleTokenChange}
          />
          <button onClick={saveToken}>Set Token</button>
        </div>
      </div>
      <ul className="list">
        {issues.map((issue) => (
          <li className="li" key={issue.id}>
            <a href={issue.html_url} target="_blank">
              {" "}
              Issue Title: {issue.title}
            </a>
            <div className="user">
              <img
                className="small-image"
                src={issue.user.avatar_url}
                alt="avatar"
              />
              Opened by:{" "}
              <a href={issue.user.html_url} target="_blank">
                {issue.user.login}
              </a>
            </div>

            <button onClick={() => toggleIssueBody(issue.id)}>
              Toggle Details
            </button>
            <div>
              {expandedIssueId === issue.id ? (
                <div>
                  <p>Assignee: {issue.assignee}</p>
                  <p>Comments: {issue.comments}</p>
                  <p className="body">
                    <strong>Body: </strong>
                    {issue.body}
                  </p>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GitRepoIssues;
