export const RNToast = (Toast, text2) => {
  Toast.show({
    type: 'rendezvousToast',
    text2: text2,
  });
};

export const formatCardNumber = text => {
  // Remove all spaces from the input
  const cleaned = text.replace(/\s+/g, '');

  // Add a space after every 4 digits
  const formatted = cleaned.replace(/(.{4})/g, '$1 ');

  return formatted.trim(); // Trim any trailing space
};

export const formatExpiryDate = text => {
  const cleaned = text.replace(/\D+/g, ''); // Remove non-digit characters
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`; // Format as MM/YY
  }
  return cleaned;
};

export const isDateExpired = expiry => {
  const [month, year] = expiry.split('/');
  if (!month || !year) {
    return false;
  }

  const currentYear = new Date().getFullYear() % 100; // Last two digits of the current year
  const currentMonth = new Date().getMonth() + 1;

  // Convert year to full year format and check
  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);

  return (
    expiryYear < currentYear ||
    (expiryYear === currentYear && expiryMonth < currentMonth)
  );
};

export function addDaysToDate() {
  // to get today's date
  const newDate = new Date();
  // this adds 1day to the selected date or today's date
  const addNewDate = newDate?.setDate(newDate?.getDate() + 1);
  // converts the date to a format
  const minimumDateToAdd = new Date(addNewDate);
  console.log('minimumDateToAdd2', minimumDateToAdd);

  return minimumDateToAdd;
}

export function formatToUSD(number) {
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function formatDateForBackend(dateString) {
  const date = new Date(dateString);

  // Extract parts of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format as YYYY-MM-DD HH:mm:ss
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const setPriceTo2DecimalPlaces = price => {
  const priceFigure = price?.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return priceFigure;
};

export const formatPriceRange = priceRange => {
  if (!priceRange || typeof priceRange !== 'string') {
    return '';
  }
  console.log('lll', priceRange);
  const [min, max] = priceRange.split('-');

  const formattedMin = setPriceTo2DecimalPlaces(Number(min));
  const formattedMax = setPriceTo2DecimalPlaces(Number(max));

  return `${formattedMin} - ${formattedMax}`;
};

export function parsePriceRange(priceRangeString) {
  if (priceRangeString.startsWith('Under')) {
    const max = parseInt(priceRangeString.replace('Under $', ''), 10);
    return {min: 0, max: max};
  } else if (priceRangeString.includes('-')) {
    const [min, max] = priceRangeString
      .replace(/\$/g, '')
      .split(' - ')
      .map(Number);

    if (!isNaN(min) && !isNaN(max)) {
      return {min, max};
    }
  } else if (priceRangeString.endsWith('+')) {
    const min = parseInt(
      priceRangeString.replace('$', '').replace('+', ''),
      10,
    );
    if (!isNaN(min)) {
      return {min, max: 1000000};
    }
  }

  // Return null for invalid formats
  return null;
}

export function parseExperienceRange(experienceRangeString) {
  // Handle "Under X years" case
  if (experienceRangeString.startsWith('Under')) {
    const max = parseInt(experienceRangeString.replace(/Under|\D/g, ''), 10);
    return {min: 0, max: max};
  }
  // Handle "X - Y years" case
  else if (experienceRangeString.includes('-')) {
    const [min, max] = experienceRangeString
      .replace(/\D/g, ' ')
      .trim()
      .split(/\s+/)
      .map(Number);

    if (!isNaN(min) && !isNaN(max)) {
      return {min, max};
    }
  } else if (experienceRangeString?.endsWith('+')) {
    const min = parseInt(experienceRangeString?.replace('+', ''), 10);
    if (!isNaN(min)) {
      return {min, max: 100};
    }
  }

  return null;
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: "2-digit",
    // minute: "2-digit",
    // timeZoneName: "short",
  };
  return date.toLocaleDateString('en-US', options);
}

export function stripHtml(htmlString) {
  // Replace HTML tags with an empty string
  return htmlString?.replace(/<\/?[^>]+(>|$)/g, '');
}

export const generateTherapistAvailability = (
  moment,
  weeklyAvailability,
  weeksAhead = 52,
) => {
  const result = {};
  const today = moment();

  for (let i = 0; i < weeksAhead * 7; i++) {
    const currentDay = today.clone().add(i, 'days');
    const weekday = currentDay.format('dddd');

    if (weeklyAvailability[weekday]) {
      result[currentDay.format('YYYY-MM-DD')] = weeklyAvailability[weekday];
    }
  }

  return result;
};

export const convertTo12HourFormat = time24 => {
  const [hourStr, minute] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${hour}:${minute} ${ampm}`;
};

export const timeAgo = timestamp => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
};

export const concatImageUrl = profilePicturePath => {
  console.log('ddd', profilePicturePath);
  const r2ImageUrl =
    'https://3ae5a5256407ccd9bf33f611a94c54bc.r2.cloudflarestorage.com/rendezvous-media';

  if (!profilePicturePath) {
    return null;
  }

  // Ensure the path does not have a leading slash to avoid double slashes
  return `${r2ImageUrl}/${profilePicturePath.replace(/^\/+/, '')}`;
};

export const generateTimeSlots = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return [];
  } // Ensure values exist

  const times = [];
  let start = parseInt(startTime.split(':')[0], 10); // Extract hour
  let end = parseInt(endTime.split(':')[0], 10);

  while (start <= end) {
    times.push(formatTime(start));
    start += 1; // Increment by 1 hour
  }

  return times;
};

const formatTime = hour => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

export const extractTime = timeStr => {
  if (!timeStr) {
    return '';
  }

  return timeStr.replace(/\s?(AM|PM)/gi, '');
};

export const formatDateTime = isoString => {
  if (!isoString) {
    return '';
  }

  const date = new Date(isoString);

  const options = {
    month: 'long', // Full month name (e.g., "April")
    day: 'numeric', // Day of the month (e.g., "2")
    year: 'numeric', // Full year (e.g., "2025")
    // hour: '2-digit', // Hour in 12-hour format
    // minute: '2-digit', // Minutes with leading zero
    // hour12: true, // Ensures 12-hour format with AM/PM
  };

  return date.toLocaleString('en-US', options);
};

export const isPriceWithinRange = (inputPrice, priceRangeArray) => {
  if (!priceRangeArray?.length || !inputPrice) {
    return false;
  }

  const [min, max] = priceRangeArray[0].split('-').map(Number);
  const price = Number(inputPrice);

  return price >= min && price <= max;
};

export function getTimeOfDayGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

export const formatToNaira = number => {
  const numeric = typeof number === 'string' ? parseFloat(number) : number;

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(numeric);
};

export const parseNairaToNumber = value => {
  if (!value) {
    return 0;
  }
  return Number(value.replace(/[^0-9.-]+/g, ''));
};

export const formatDistance = meters => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const formatDuration = seconds => {
  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} min`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

export const formatPerMinute = seconds => {
  if (seconds < 60) {
    return `${Math.round(seconds)}`;
  } else {
    console.log('fff', `${Math.round(seconds / 60)}`);
    return `${Math.round(seconds / 60)}`;
  }
};

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const metersToKilometers = meters => {
  if (!meters || isNaN(meters)) {
    return '0 km';
  }
  return `${(meters / 1000).toFixed(2)}`;
};

export const getCityAndCountry = async (
  lat,
  lng,
  GOOGLE_MAPS_PLACES_API_KEY,
) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_PLACES_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
      console.error('Geocoding failed', data);
      return null;
    }

    const components = data.results[0].address_components;
    console.log('components', components);

    const city = components.find(
      c =>
        c.types.includes('locality') ||
        c.types.includes('administrative_area_level_1'),
    )?.long_name;

    const country = components.find(c =>
      c.types.includes('country'),
    )?.long_name;

    console.log('getCityAndCountry', city, country);

    return {city, country};
  } catch (err) {
    console.error('Geocode error:', err);
    return null;
  }
};
