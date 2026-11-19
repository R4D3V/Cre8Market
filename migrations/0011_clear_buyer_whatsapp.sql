-- Buyers no longer use WhatsApp at all: the registration form, profile editor
-- and admin buyer screens no longer collect or show it. Clear the phone-number
-- fallback that older buyer rows stored so nothing stale remains.
--
-- Sellers keep their WhatsApp contact details.
--
-- Safe to re-run: the UPDATE matches nothing once buyer rows are cleared.

UPDATE users SET whatsapp = NULL WHERE account_type = 'buyer' AND whatsapp IS NOT NULL;
