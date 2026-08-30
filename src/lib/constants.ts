/**
 * StashSaarthi Global Platform Constants
 */

export const FOUNDER_NAME = "Advik Omer";
export const FOUNDER_WHATSAPP = "919369454350";
export const FOUNDER_PHONE_DISPLAY = "+91 9369454350";
export const FOUNDER_PHONE_RAW = "9369454350";
export const FOUNDER_EMAIL = "stashsaarthi@gmail.com";

// Primary live domain for share links, messages & referrals
export const APP_BASE_URL = "https://stashsaarthi-web.vercel.app";

// Central toggle: Set to FALSE when going live with 100% real verified inventory
export const SHOW_PROTOTYPE_TAGS = true;

/**
 * Generate a standard WhatsApp redirection URL
 */
export const getWhatsAppUrl = (text: string, phone: string = FOUNDER_WHATSAPP) => {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(text)}`;
};
