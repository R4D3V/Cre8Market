import type { CategoryDB } from "@/lib/types";

interface CategoryOptionsProps {
  categories: CategoryDB[];
  /** Also let the group itself be picked (used by the products filter). */
  includeParents?: boolean;
  /** Keep the current selection visible when a listing is filed at group level. */
  currentValue?: string;
  /** Listing forms store the slug; Sell To Us uses the display name. */
  valueField?: "slug" | "name";
}

/**
 * Renders a two-level category list as <optgroup>s so every category dropdown
 * shows the group heading followed by its subcategories.
 */
export default function CategoryOptions({
  categories,
  includeParents = false,
  currentValue,
  valueField = "slug",
}: CategoryOptionsProps) {
  const parents = categories.filter((c) => !c.parent_id);
  const parentIds = new Set(parents.map((p) => p.id));
  const childrenByParent = new Map<string, CategoryDB[]>();

  for (const category of categories) {
    if (!category.parent_id) continue;
    const list = childrenByParent.get(category.parent_id) ?? [];
    list.push(category);
    childrenByParent.set(category.parent_id, list);
  }

  const optionValue = (category: CategoryDB) =>
    valueField === "name" ? category.name : category.slug;

  // A child whose parent is missing (e.g. a filtered API response) still needs
  // to be selectable, so fall back to a flat option.
  const orphans = categories.filter((c) => c.parent_id && !parentIds.has(c.parent_id));

  return (
    <>
      {parents.map((parent) => {
        const children = childrenByParent.get(parent.id) ?? [];
        const parentValue = optionValue(parent);

        if (children.length === 0) {
          return (
            <option key={parent.id} value={parentValue}>
              {parent.icon} {parent.name}
            </option>
          );
        }

        return (
          <optgroup key={parent.id} label={`${parent.icon} ${parent.name}`}>
            {(includeParents || currentValue === parentValue) && (
              <option value={parentValue}>{parent.name}</option>
            )}
            {children.map((child) => (
              <option key={child.id} value={optionValue(child)}>
                {child.icon} {child.name}
              </option>
            ))}
          </optgroup>
        );
      })}
      {orphans.map((category) => (
        <option key={category.id} value={optionValue(category)}>
          {category.icon} {category.name}
        </option>
      ))}
    </>
  );
}
