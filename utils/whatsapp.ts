
export function generateWhatsAppLink(phone: string | null | undefined, message: string) {
    if (!phone) return null
    const cleanPhone = phone.replace(/[^\d]/g, '')
    // Assume generic country code +91 if not present, or use as is
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${finalPhone}?text=${encodedMessage}`
}
