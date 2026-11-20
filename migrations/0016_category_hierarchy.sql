-- Two-level product taxonomy: category groups (parents) and subcategories (children).
-- Existing categories are preserved. The three slugs that already existed with the
-- same meaning (phones-tablets, electronics, home-appliances) become parent groups,
-- and a few older flat categories are nested under the new groups so their listings
-- stay reachable from the grouped filters.

ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- ── Parent groups ──
INSERT INTO categories (name, slug, icon, color, bg_color) VALUES
  ('Phones & Tablets', 'phones-tablets', '📱', '#3b82f6', '#eff6ff'),
  ('Computing', 'computing', '💻', '#8b5cf6', '#f5f3ff'),
  ('Electronics', 'electronics', '🎧', '#6366f1', '#eef2ff'),
  ('Home & Office', 'home-office', '🏠', '#10b981', '#ecfdf5'),
  ('Home Appliances', 'home-appliances', '🔌', '#f59e0b', '#fffbeb'),
  ('Fashion', 'fashion', '👗', '#ec4899', '#fdf2f8'),
  ('Health & Beauty', 'health-beauty', '💄', '#f43f5e', '#fff1f2'),
  ('Supermarket', 'supermarket', '🛒', '#22c55e', '#f0fdf4'),
  ('Baby Products', 'baby-products', '🍼', '#38bdf8', '#f0f9ff'),
  ('Sporting Goods', 'sporting-goods', '⚽', '#f97316', '#fff7ed'),
  ('Gaming', 'gaming', '🎮', '#7c3aed', '#f5f3ff'),
  ('Automotive', 'automotive', '🚗', '#64748b', '#f8fafc')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      icon = EXCLUDED.icon,
      color = EXCLUDED.color,
      bg_color = EXCLUDED.bg_color;

-- ── Subcategories ──
INSERT INTO categories (name, slug, icon, color, bg_color, parent_id)
SELECT v.name, v.slug, v.icon, v.color, v.bg_color, p.id
FROM (VALUES
  ('Mobile phones', 'mobile-phones', '📱', '#3b82f6', '#eff6ff', 'phones-tablets'),
  ('Smartphones', 'smartphones', '📲', '#3b82f6', '#eff6ff', 'phones-tablets'),
  ('Tablets', 'tablets', '📱', '#3b82f6', '#eff6ff', 'phones-tablets'),
  ('Phone accessories', 'phone-accessories', '🔌', '#3b82f6', '#eff6ff', 'phones-tablets'),
  ('Smartwatches', 'smartwatches', '⌚', '#3b82f6', '#eff6ff', 'phones-tablets'),

  ('Laptops', 'laptops', '💻', '#8b5cf6', '#f5f3ff', 'computing'),
  ('Desktop computers', 'desktop-computers', '🖥️', '#8b5cf6', '#f5f3ff', 'computing'),
  ('Computer accessories', 'computer-accessories', '🖱️', '#8b5cf6', '#f5f3ff', 'computing'),
  ('Printers', 'printers', '🖨️', '#8b5cf6', '#f5f3ff', 'computing'),
  ('Storage devices', 'storage-devices', '💾', '#8b5cf6', '#f5f3ff', 'computing'),

  ('Televisions', 'televisions', '📺', '#6366f1', '#eef2ff', 'electronics'),
  ('Audio systems', 'audio-systems', '🔊', '#6366f1', '#eef2ff', 'electronics'),
  ('Headphones', 'headphones', '🎧', '#6366f1', '#eef2ff', 'electronics'),
  ('Cameras', 'cameras', '📷', '#6366f1', '#eef2ff', 'electronics'),
  ('Speakers', 'speakers', '🔈', '#6366f1', '#eef2ff', 'electronics'),
  ('Electronics accessories', 'electronics-accessories', '🔌', '#6366f1', '#eef2ff', 'electronics'),

  ('Furniture', 'furniture', '🛋️', '#10b981', '#ecfdf5', 'home-office'),
  ('Home décor', 'home-decor', '🏺', '#10b981', '#ecfdf5', 'home-office'),
  ('Bedding', 'bedding', '🛏️', '#10b981', '#ecfdf5', 'home-office'),
  ('Kitchen and dining', 'kitchen-dining', '🍽️', '#10b981', '#ecfdf5', 'home-office'),
  ('Home improvement', 'home-improvement', '🔨', '#10b981', '#ecfdf5', 'home-office'),
  ('Office supplies', 'office-supplies', '📎', '#10b981', '#ecfdf5', 'home-office'),

  ('Refrigerators', 'refrigerators', '🧊', '#f59e0b', '#fffbeb', 'home-appliances'),
  ('Washing machines', 'washing-machines', '🌀', '#f59e0b', '#fffbeb', 'home-appliances'),
  ('Cookers', 'cookers', '🍳', '#f59e0b', '#fffbeb', 'home-appliances'),
  ('Microwaves', 'microwaves', '♨️', '#f59e0b', '#fffbeb', 'home-appliances'),
  ('Electric kettles', 'electric-kettles', '☕', '#f59e0b', '#fffbeb', 'home-appliances'),
  ('Irons', 'irons', '🧺', '#f59e0b', '#fffbeb', 'home-appliances'),

  ('Men''s fashion', 'mens-fashion', '👔', '#ec4899', '#fdf2f8', 'fashion'),
  ('Women''s fashion', 'womens-fashion', '👗', '#ec4899', '#fdf2f8', 'fashion'),
  ('Children''s clothing', 'childrens-clothing', '🧒', '#ec4899', '#fdf2f8', 'fashion'),
  ('Shoes', 'shoes', '👟', '#ec4899', '#fdf2f8', 'fashion'),
  ('Bags', 'bags', '👜', '#ec4899', '#fdf2f8', 'fashion'),
  ('Watches', 'watches', '⌚', '#ec4899', '#fdf2f8', 'fashion'),
  ('Jewellery', 'jewellery', '💍', '#ec4899', '#fdf2f8', 'fashion'),
  ('Fashion accessories', 'fashion-accessories', '🕶️', '#ec4899', '#fdf2f8', 'fashion'),

  ('Skincare', 'skincare', '🧴', '#f43f5e', '#fff1f2', 'health-beauty'),
  ('Haircare', 'haircare', '💇', '#f43f5e', '#fff1f2', 'health-beauty'),
  ('Makeup', 'makeup', '💄', '#f43f5e', '#fff1f2', 'health-beauty'),
  ('Fragrances', 'fragrances', '🌸', '#f43f5e', '#fff1f2', 'health-beauty'),
  ('Personal care', 'personal-care', '🧼', '#f43f5e', '#fff1f2', 'health-beauty'),
  ('Health and wellness products', 'health-wellness', '💊', '#f43f5e', '#fff1f2', 'health-beauty'),

  ('Food and groceries', 'food-groceries', '🛒', '#22c55e', '#f0fdf4', 'supermarket'),
  ('Beverages', 'beverages', '🥤', '#22c55e', '#f0fdf4', 'supermarket'),
  ('Snacks', 'snacks', '🍿', '#22c55e', '#f0fdf4', 'supermarket'),
  ('Household essentials', 'household-essentials', '🧻', '#22c55e', '#f0fdf4', 'supermarket'),
  ('Cleaning products', 'cleaning-products', '🧽', '#22c55e', '#f0fdf4', 'supermarket'),

  ('Baby clothing', 'baby-clothing', '👶', '#38bdf8', '#f0f9ff', 'baby-products'),
  ('Feeding products', 'feeding-products', '🍼', '#38bdf8', '#f0f9ff', 'baby-products'),
  ('Baby care', 'baby-care', '🧷', '#38bdf8', '#f0f9ff', 'baby-products'),
  ('Toys', 'toys', '🧸', '#38bdf8', '#f0f9ff', 'baby-products'),
  ('Baby equipment', 'baby-equipment', '🚼', '#38bdf8', '#f0f9ff', 'baby-products'),

  ('Fitness equipment', 'fitness-equipment', '🏋️', '#f97316', '#fff7ed', 'sporting-goods'),
  ('Sportswear', 'sportswear', '🎽', '#f97316', '#fff7ed', 'sporting-goods'),
  ('Outdoor equipment', 'outdoor-equipment', '🏕️', '#f97316', '#fff7ed', 'sporting-goods'),
  ('Sports accessories', 'sports-accessories', '⚽', '#f97316', '#fff7ed', 'sporting-goods'),

  ('Gaming consoles', 'gaming-consoles', '🎮', '#7c3aed', '#f5f3ff', 'gaming'),
  ('Video games', 'video-games', '🕹️', '#7c3aed', '#f5f3ff', 'gaming'),
  ('Gaming accessories', 'gaming-accessories', '🎧', '#7c3aed', '#f5f3ff', 'gaming'),

  ('Car accessories', 'car-accessories', '🚗', '#64748b', '#f8fafc', 'automotive'),
  ('Vehicle maintenance products', 'vehicle-maintenance', '🔧', '#64748b', '#f8fafc', 'automotive'),
  ('Automotive accessories', 'automotive-accessories', '🛠️', '#64748b', '#f8fafc', 'automotive')
) AS v(name, slug, icon, color, bg_color, parent_slug)
JOIN categories p ON p.slug = v.parent_slug
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      icon = EXCLUDED.icon,
      color = EXCLUDED.color,
      bg_color = EXCLUDED.bg_color,
      parent_id = EXCLUDED.parent_id;

-- ── Legacy categories that predate the taxonomy ──
-- Keep them (and their listings) but file them under the closest new group.
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'computing')
WHERE slug = 'computers-laptops' AND parent_id IS NULL;
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'computing')
WHERE slug = 'routers-mifi' AND parent_id IS NULL;
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'fashion')
WHERE slug = 'clothing-fashion' AND parent_id IS NULL;
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'health-beauty')
WHERE slug = 'wigs-hair' AND parent_id IS NULL;
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'health-beauty')
WHERE slug = 'perfumes-beauty' AND parent_id IS NULL;
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'supermarket')
WHERE slug = 'food-agriculture' AND parent_id IS NULL;
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'home-office')
WHERE slug = 'tools-equipment' AND parent_id IS NULL;
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'automotive')
WHERE slug = 'vehicles' AND parent_id IS NULL;
