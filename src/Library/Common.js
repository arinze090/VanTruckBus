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
  const priceFigure = price?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return priceFigure;
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
    hour: '2-digit', // Hour in 12-hour format
    minute: '2-digit', // Minutes with leading zero
    hour12: true, // Ensures 12-hour format with AM/PM
  };

  return date.toLocaleString('en-US', options);
};
