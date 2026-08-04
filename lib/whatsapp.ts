export function getWhatsAppUrl(
  phone: string,
  name: string,
  propertyTitle?: string
): string {
  // Format nomor WhatsApp (Ubah '08...' menjadi '628...')
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  }

  const title = propertyTitle || "properti impian Anda";
  const message = `Halo ${name}, saya dari Realthink Property. Saya ingin menindaklanjuti mengenai ${title}.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}