import type { ContactFormData } from "@/types";

export const validators: Record<string, (v: string) => string> = {
  name: (v) => {
    const trimmed = v.trim();
    const nameCharacterCheck = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!trimmed) return "Your name is required.";
    if (/^[0-9]/.test(trimmed)) return "Name cannot start with a number.";
    if (!nameCharacterCheck.test(trimmed))
      return "Please enter a valid name (e.g. Sujal Pokherel).";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return ""; // optional - but if given, must be valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v.trim()))
      return "Please enter a valid email address (e.g. you@example.com).";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Phone / WhatsApp number is required.";
    const digits = v.replace(/\D/g, "");
    if (digits.length < 9) return "Please enter a valid phone number.";
    return "";
  },
  message: (v) => {
    if (!v.trim()) return "Message is required.";
    if (v.trim().length < 5) return "Message must be at least 5 characters.";
    return "";
  },
};

export function buildWhatsAppMessage(form: ContactFormData): string {
  const lines = [
    `New website inquiry`,
    ``,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    form.email ? `Email: ${form.email}` : null,
    `Topic: ${form.subject}`,
    ``,
    `Message:`,
    form.message,
  ].filter(Boolean);
  return lines.join("\n");
}
