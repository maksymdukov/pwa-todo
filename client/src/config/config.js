export const config = {
  URL: process.env.REACT_APP_URL || window.location.origin,
  BASE_API_URL: process.env.REACT_APP_BASE_API_URL || `${window.location.origin}/api/v0`,
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
  VAPID_PUBLIC_KEY: process.env.REACT_APP_VAPID_PUBLIC_KEY,
};
