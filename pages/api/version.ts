import packageInfo from '../../package.json';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get version from package.json
    const version = packageInfo.version;

    // Try to get the git hash from GitHub API
    let gitHash = process.env.NEXT_PUBLIC_GIT_HASH || 'dev';

    // Only fetch from GitHub if we don't have a hash from the environment
    if (gitHash === 'dev') {
      try {
        const repoOwner = 'LynkrApp';
        const repoName = 'Website';
        const branch = 'main'; // or master, depending on your default branch

        const headers = {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Lynkr-App',
        };

        // Add authorization header if GitHub token is available
        if (process.env.GITHUB_TOKEN) {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branch}`,
          { headers }
        );

        if (response.ok) {
          const data = await response.json();
          gitHash = data.sha || 'dev';
        }
      } catch (error) {
        console.error('Error fetching git hash:', error);
      }
    }

    return res.status(200).json({
      version,
      gitHash,
      buildTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in version API:', error);
    return res.status(500).json({
      message: 'Failed to retrieve version information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
