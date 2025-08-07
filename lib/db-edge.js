// Edge-compatible database access
// This file provides a fetch-based approach to access data in edge functions

/**
 * Fetches user data for OG image generation
 * @param {string} username - The user's handle
 * @returns {Promise<Object|null>} User data or null if not found
 */
export async function getUserForOG(username) {
  // Using environment variables to construct the internal API URL
  // This approach calls our own API from within the edge function
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';
  const url = `${baseUrl}/api/internal/user?handle=${encodeURIComponent(username)}&og=true&includeAnalytics=true`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        // Internal API key for security (should be set in environment variables)
        'x-api-key': process.env.INTERNAL_API_KEY || 'internal-api-access',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user data: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Edge DB Error:', error);
    return null;
  }
}
