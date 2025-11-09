import axios from 'axios';

interface ExchangeRateCache {
  rate: number;
  timestamp: number;
}

// Cache for 1 hour (3600 * 1000 milliseconds)
const CACHE_DURATION = 3600 * 1000; 

let cache: ExchangeRateCache | null = null;

/**
 * Fetches the latest USD to RUB exchange rate.
 * Implements in-memory caching to avoid excessive API calls.
 * @returns {Promise<number>} The current USD to RUB exchange rate.
 */
export async function getRubToUsdRate(): Promise<number> {
  const now = Date.now();

  // If we have a valid cache, return it
  if (cache && (now - cache.timestamp < CACHE_DURATION)) {
    return cache.rate;
  }

  try {
    // Using frankfurter.app API, which is free and requires no API key
    const response = await axios.get('https://api.frankfurter.app/latest?from=USD&to=RUB');
    
    if (response.data && response.data.rates && response.data.rates.RUB) {
      const rate = response.data.rates.RUB;
      
      // Update cache
      cache = {
        rate: rate,
        timestamp: now,
      };
      
      return rate;
    } else {
      throw new Error('Invalid response structure from currency API');
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    // Fallback to a default rate or re-throw the error
    // For now, we'll throw, but in a real app you might want a more robust fallback
    throw new Error('Could not fetch RUB/USD exchange rate.');
  }
}
