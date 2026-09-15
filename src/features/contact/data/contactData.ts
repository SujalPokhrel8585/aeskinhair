// Static contact form defaults used by the contact page.

import type { ContactFormData } from "@/types";

export const INITIAL_FORM: ContactFormData = {
  name: "",
  phone: "",
  email: "",
  subject: "General Inquiry",
  message: "",
};
