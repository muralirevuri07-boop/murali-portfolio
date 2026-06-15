import { useEffect, useState } from 'react'

function GitHubProjects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.github.com/users/muralirevuri07-boop/repos')
      .then(res => res.json())
      .then(data => {
        // Filter out specific projects
        const filteredRepos = data.filter(repo => 
          repo.name !== 'ai-agent-project' && 
          repo.name !== 'neural-rag-system'
        )
        setRepos(filteredRepos)
        setLoading(false)
      })
      .catch(err => {
        console.error('GitHub API error:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="github-section">
        <h2>📦 Loading GitHub Projects...</h2>
      </div>
    )
  }

  return (
    <section className="github-section">
      <h2 className="section-title">📦 LIVE GITHUB PROJECTS</h2>
      <div className="projects-grid">
        {repos.map((repo) => (
          <div className="project-card" key={repo.id}>
            <h3>{repo.name.replace(/-/g, ' ')}</h3>
            <p>{repo.description || 'AI agent project with cutting-edge tech'}</p>
            <div className="repo-stats">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🔱 {repo.forks_count}</span>
              <span>📝 {repo.language || 'AI/ML'}</span>
            </div>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="project-btn">
              View on GitHub →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default GitHubProjects