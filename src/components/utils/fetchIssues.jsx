import axios from 'axios';

const fetchRepoIssues = async (url) => {
 
  const urlParts = url.split('/');
  const repoName = urlParts[urlParts.length - 1];
  const user = urlParts[urlParts.length - 2];

  let token = localStorage['token'];
  let gitHubLink = `https://api.github.com/repos/${user}/${repoName}/issues`;
  let headers = {
    Authorization: `${token}}`,
  };

  debugger
  try {
    const res = await axios.get(gitHubLink, { headers });
    debugger
    return res;
  } catch (err) {
    console.log(err);
  }
};

export default fetchRepoIssues;
