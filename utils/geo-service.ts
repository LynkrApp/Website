import axios from 'axios';

export type GeoLocation = {
  country: string;
  countryName: string;
  region: string;
  city: string;
  timezone: string;
};

export async function getLocationFromIp(ip?: string | null): Promise<GeoLocation | null> {
  if (!ip || ['127.0.0.1', '::1', 'localhost'].includes(ip)) {
    return null;
  }

  try {
    const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`, {
      timeout: 3000,
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

