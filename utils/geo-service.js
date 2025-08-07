import axios from 'axios';

/**
 * Get location information from an IP address
 *
 * @param {string} ip - The IP address to lookup
 * @returns {Promise<Object|null>} - Location data or null if unavailable
 */
export async function getLocationFromIp(ip) {
  // Skip geolocation for local IPs
  if (!ip || ['127.0.0.1', '::1', 'localhost'].includes(ip)) {
    return null;
  }

  try {
    // Free IP geolocation API (consider using a paid service for production)
    const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`, {
      timeout: 3000, // 3 second timeout to avoid slowing down requests
    });

    if (geoResponse.data.status === 'success') {
      return {
        country: geoResponse.data.countryCode,
        countryName: geoResponse.data.country,
        region: geoResponse.data.regionName,
        city: geoResponse.data.city,
        timezone: geoResponse.data.timezone,
      };
    }
    return null;
  } catch (error) {
    console.error('IP geolocation error:', error);
    return null;
  }
}
