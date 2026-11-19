-- Keep the subscription plan copy in sync with the enforced listing limits:
-- Free 5 listings, Standard 30 listings, Premium unlimited (see lib/plans.ts).
--
-- Only the listing bullet is rewritten so admin edits to the other feature
-- bullets survive. Rows that no longer contain the old copy are untouched.

UPDATE subscription_plans
SET features = COALESCE(
      (
        SELECT jsonb_agg(
                 CASE
                   WHEN item = to_jsonb('Up to 3 active product listings'::text)
                     THEN to_jsonb('Up to 5 active product listings'::text)
                   WHEN item = to_jsonb('Up to 20 active product listings'::text)
                     THEN to_jsonb('Up to 30 active product listings'::text)
                   ELSE item
                 END
                 ORDER BY ord
               )
        FROM jsonb_array_elements(features) WITH ORDINALITY AS t(item, ord)
      ),
      features
    ),
    updated_at = now()
WHERE features @> '["Up to 3 active product listings"]'::jsonb
   OR features @> '["Up to 20 active product listings"]'::jsonb;
