import React, { useState, useEffect, useCallback } from "react";
import fetchRepoIssues from "./utils/fetchIssues";
import Issue from "./Issue";

const GitRepoIssues = () => {
  // Variables
  const [url, setUrl] = useState("");
  // disable fetch button until token is set
  const [disabled, setDisabled] = useState(true);
  // array of issues pulled from github and set to local storage
  const [issues, setIssues] = useState([]);
  //INPUT TOKEN
  const [token, setToken] = useState("");
  const [expandedIssueId, setExpandedIssueId] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [repoName, setRepoName] = useState("");
  const [localStorageToken, setLocalStorageToken] = useState(null);

  useEffect(() => {
    handleLocalStorageToken();
    handleLocalStorageIssues();
  }, []);

  const handleLocalStorageToken = () => {
    const localStorageToken = localStorage.getItem("token");
    if (localStorageToken !== null) {
      // setToken(localStorageToken);
      setLocalStorageToken(localStorageToken);
      setDisabled(false);
    }
  }

  const handleLocalStorageIssues = () => {
    const localStorageIssues = localStorage.getItem("localStorageIssues");
    const localStorageTime = localStorage.getItem("time");
    const currentTime = new Date().getTime();

    // if issues are in local storage and time is less than 5 minutes
    if (
      localStorageIssues !== null &&
      localStorageTime !== null &&
      currentTime - localStorageTime < 300000
    ) {
      let data = JSON.parse(localStorageIssues);
      setRepoName(data[0].repository_url.split("/")[5])
      setIssues(data);
    } else {
      localStorage.setItem("time", currentTime);
      if (localStorageIssues) {
        fetchRepoIssues(url).then((res) => {
          setIssues(res.data);
          setRepoName(res.data[0].repository_url.split("/")[5])
          localStorage.setItem("localStorageIssues", JSON.stringify(res.data));
        });
      }
    }
  }

  // handle github url input change
  const handleUrlChange = (e) => { setUrl(e.target.value)};
  // handle github token input change
  const handleTokenChange = (e) => {setToken(e.target.value)};

  // add token to local storage
  const submitToken = (e) => {
    debugger
    if (localStorage.getItem("token") === null) {
      localStorage.setItem("token", token)
      setDisabled(false);
      setLocalStorageToken(token);
      setToken("");
    } else {
      localStorage.removeItem("token");
      setDisabled(true);
      setLocalStorageToken(null);
      setToken("");
    }
  };

  const clearIssues = () => {
    // Clear the 'issues state and remove the localStorage issues from localStorage
    setIssues([]);
    localStorage.removeItem("localStorageIssues");
    localStorage.removeItem("time");
    setRepoName("");
    setUrl("");
  };

  const handleFetchSubmit = () => {
    // Fetch issues based on the GitHub repository URL entered
    // and update the 'issues state with the data
    fetchRepoIssues(url).then((res) => {
      setIssues(res.data);
      setRepoName(res.data[0].repository_url.split("/")[5])
      localStorage.setItem("localStorageIssues", JSON.stringify(res.data));
      localStorage.setItem("time", new Date().getTime());
    });
  };

  // onclick of id set the expanded issue id
  const toggleIssueBody = (issueId) => {
    setExpandedIssueId((prevId) => (prevId === issueId ? null : issueId));
  };

  return (
    <div className="repodiv">
      {repoName.length > 0 ?  (<h1>{`${repoName}`}</h1>) : <h1>GitHub Repo Issues </h1> }
      <div className="buttons">
        <div>
          <label>
            Repository URL (FORMAT : https://github.com/OWNER/REPO/)
          </label>
          <br />
          <input
            type="text"
            placeholder="Enter GitHub repository URL...."
            value={url}
            // defaultValue={localStorage.getItem("url")}
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
          <label>Token</label>
          <input
            type="password"
            placeholder={localStorageToken !== null ? "Token Already Set" : "Enter GitHub token"}
            value={token}
            onChange={handleTokenChange}
          />
          <button onClick={submitToken}>{localStorageToken === null ? "Set Token" : "Clear Token"}</button>
        </div>
      </div>
      
      {issues.length > 0 ? 
      (<div><h1 className="list">Issues</h1>
       <label>Search by Issue Title:  </label> 
       <input 
        type="text" 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
        />
        </div>
        ) : null}

      <ul>
        {issues.filter(issue => issue.title.toLowerCase().includes(searchValue)).map((issue) => (
          <Issue
            key={issue.id}
            issue={issue}
            expandedIssueId={expandedIssueId}
            toggleIssueBody={toggleIssueBody}
          />
        ))}
      </ul>
    </div>
  );
};


export default GitRepoIssues;