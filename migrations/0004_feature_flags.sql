-- Seed the feature flags surfaced on the admin dashboard.
-- Existing rows are left untouched, so toggles survive re-running this file.
INSERT INTO feature_flags (key, enabled, description)
VALUES
  ('deals', true, 'Show the Deals page and deal promotions across the marketplace.'),
  ('push-notifications', true, 'Let visitors enable web push notifications from the install page.')
ON CONFLICT (key) DO NOTHING;
