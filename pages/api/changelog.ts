export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const repoOwner = 'LynkrApp';
        const repoName = 'Website';

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Lynkr-App'
        };

        // Add authorization header if token is available
        if (githubToken) {
            headers['Authorization'] = `token ${githubToken}`;
        }

        const response = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/releases`,
            { headers }
        );

        if (!response.ok) {
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }

        const releases = await response.json();

        // Transform GitHub releases into our changelog format
        const changelog = releases.map(release => {
            const version = release.tag_name.replace(/^v/, ''); // Remove 'v' prefix if present
            const date = new Date(release.published_at).toISOString().split('T')[0];

            // Parse release body to extract different types of changes
            const changes = parseReleaseBody(release.body || '');

            // Determine release type based on changes or pre-release status
            const type = release.prerelease ? 'prerelease' :
                changes.some(c => c.type === 'feature') ? 'feature' :
                    changes.some(c => c.type === 'fix') ? 'fix' : 'improvement';

            return {
                version,
                date,
                type,
                title: release.name || `Version ${version}`,
                changes,
                url: release.html_url,
                draft: release.draft,
                prerelease: release.prerelease
            };
        });

        // Filter out draft releases and sort by date (newest first)
        const filteredChangelog = changelog
            .filter(release => !release.draft)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return res.status(200).json(filteredChangelog);
    } catch (error) {
        console.error('Error fetching changelog:', error);
        return res.status(500).json({
            message: 'Failed to fetch changelog data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

function parseReleaseBody(body) {
    const changes = [];

    if (!body) return changes;

    // Split by lines and process each line
    const lines = body.split('\n').map(line => line.trim()).filter(line => line);

    for (const line of lines) {
        // Skip markdown headers and empty lines
        if (line.startsWith('#') || line.startsWith('---') || line === '') continue;

        // Parse different markdown list formats
        let type = 'improvement'; // default
        let text = line;

        // Remove markdown list indicators
        text = text.replace(/^[-*+]\s*/, '').replace(/^\d+\.\s*/, '');

        // Determine type based on keywords or emoji
        if (text.match(/^(✨|🎉|feat|feature|add|new)/i)) {
            type = 'feature';
            text = text.replace(/^(✨|🎉|feat|feature|add|new):?\s*/i, '');
        } else if (text.match(/^(🐛|🔧|fix|bug|resolve|patch)/i)) {
            type = 'fix';
            text = text.replace(/^(🐛|🔧|fix|bug|resolve|patch):?\s*/i, '');
        } else if (text.match(/^(⚡|🚀|improve|enhance|update|optimize)/i)) {
            type = 'improvement';
            text = text.replace(/^(⚡|🚀|improve|enhance|update|optimize):?\s*/i, '');
        } else if (text.match(/^(🗑️|💥|remove|delete|deprecate|break)/i)) {
            type = 'breaking';
            text = text.replace(/^(🗑️|💥|remove|delete|deprecate|break):?\s*/i, '');
        }

        // Clean up the text
        text = text.replace(/^\w+:\s*/, ''); // Remove any remaining prefixes

        if (text) {
            changes.push({ type, text });
        }
    }

    // If no changes were parsed but we have content, create a generic entry
    if (changes.length === 0 && body.trim()) {
        changes.push({
            type: 'improvement',
            text: body.replace(/[\r\n]+/g, ' ').trim()
        });
    }

    return changes;
}
