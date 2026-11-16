-- Admin store banner: image shown at the top of the public store seller page
-- (/sellers/store). Editable from /admin/profile.

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS banner TEXT;
