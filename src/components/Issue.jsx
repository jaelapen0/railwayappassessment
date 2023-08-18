import React from "react";

const Issue = ({ issue, toggleIssueBody, expandedIssueId }) => {

  return (
    <li className="li" key={issue.id}>
      <a href={issue.html_url} target="_blank">
        {" "}
        Issue Title: {issue.title}
      </a>
      <div className="user">
        
        <p>Opened by:  </p>
        <a href={issue.user.html_url} target="_blank">
          {`   ${issue.user.login} `}
        </a>
        <img
          className="small-image"
          src={issue.user.avatar_url}
          alt="avatar"
        />
      </div>

      <button onClick={() => toggleIssueBody(issue.id)}>
        Toggle Details
      </button>
      <div>
        {expandedIssueId === issue.id ? (
          <div>
            <p>{ issue?.pull_request?.html_url ? <a href={issue.pull_request.html_url} target="_blank">Pull Request</a> : null }</p>
            <p>Comments: {issue.comments}</p>
            <p className="body">
              <strong>Body: </strong>
              {issue.body.replace(/<[^>]*>/g, '')}
            </p>
          </div>
        ) : null}
      </div>
    </li>
  )
}

export default Issue;