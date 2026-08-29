/**
 * StashSaarthi Global Platform Constants
 */

export const FOUNDER_WHATSAPP = "919369454350";
export const FOUNDER_PHONE_DISPLAY = "+91 9369454350";
export const FOUNDER_PHONE_RAW = "9369454350";
export const FOUNDER_EMAIL = "connect@stashsaarthi.in";

// Central toggle: Set to FALSE when going live with 100% real verified inventory
export const SHOW_PROTOTYPE_TAGS = true;

/**
 * Generate a standard WhatsApp redirection URL
 */
export const getWhatsAppUrl = (text: string, phone: string = FOUNDER_WHATSAPP) => {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(text)}`;
};
