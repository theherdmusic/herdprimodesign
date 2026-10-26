// Browser-safe: shared rules for the Herd sign-up steps (fan and artist).
export type PersonalInfo = { first: string; last: string; address: string; city: string; state: string; zip: string; phone: string };
export type Captcha = [number, number];

export const newCaptcha = (): Captcha => [1 + Math.floor(Math.random() * 9), 1 + Math.floor(Math.random() * 9)];

// Every sign-up path (fan and artist) asks for the same real-person details.
export function validatePersonal(name: string, nameLabel: string, info: PersonalInfo, email: string, captcha: Captcha, answer: string): string {
  if (!name.trim()) return `Add your ${nameLabel}.`;
  if (!info.first.trim() || !info.last.trim()) return 'Add your first and last name.';
  if (!info.address.trim() || !info.city.trim() || !info.state.trim()) return 'Add your full address.';
  if (!/^\d{5}(-\d{4})?$/.test(info.zip.trim())) return 'Enter a valid ZIP code.';
  if (info.phone.replace(/\D/g, '').length < 10) return 'Enter a valid phone number.';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email.';
  if (Number(answer) !== captcha[0] + captcha[1]) return 'Captcha answer is wrong. Try the new one.';
  return '';
}
