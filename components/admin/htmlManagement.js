/**
 * Updates a specific field within the menuData structure.
 * Handles both top-level items and items nested within subItems.
 */
export const updateMenuField = (menuData, menuId, subId, field, subField, value) => {
  return menuData.map((item) => {
    // Case 1: Top-level item match (no subItems)
    if (item.id === subId && !item.subItems) {
      return {
        ...item,
        [field]: { ...item[field], [subField]: value }
      };
    }

    // Case 2: Parent item match, update the correct subItem
    if (item.id === menuId && item.subItems) {
      return {
        ...item,
        subItems: item.subItems.map((sub) =>
          sub.id === subId
            ? { ...sub, [field]: { ...sub[field], [subField]: value } }
            : sub
        ),
      };
    }

    return item;
  });
};

export const copyToClipboard = async (text) => {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy!", err);
    return false;
  }
};