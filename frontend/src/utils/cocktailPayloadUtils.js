export const buildCocktailPayload = (cocktail) => {
  const payload = { ...cocktail };

  const serializeRelatedField = (fieldValue) => {
    if (!fieldValue) return [];
    if (Array.isArray(fieldValue)) {
      return fieldValue.map((item) => ({ value: item?.value ?? item?.id ?? item }));
    }
    return [{ value: fieldValue?.value ?? fieldValue?.id ?? fieldValue }];
  };

  const chineseName = cocktail.chinese_name || cocktail.Chinese_Name;
  const englishName = cocktail.english_name || cocktail.English_Name;
  if (chineseName !== undefined) {
    payload.chinese_name = chineseName;
    payload.Chinese_Name = chineseName;
  }
  if (englishName !== undefined) {
    payload.english_name = englishName;
    payload.English_Name = englishName;
  }

  const getCategoryItems = (cat) => {
    if (cocktail[cat] || cocktail[cat.charAt(0).toUpperCase() + cat.slice(1)]) {
      return cocktail[cat] || cocktail[cat.charAt(0).toUpperCase() + cat.slice(1)];
    }
    if (Array.isArray(cocktail.recipe_items)) {
      const singular =
        cat === "bases"
          ? "base"
          : cat === "liqueurs"
          ? "liqueur"
          : cat === "alcohols"
          ? "alcohol"
          : "ingredient";
      return cocktail.recipe_items
        .filter((r) => r.material && r.material.category === singular)
        .map((r) => r.material);
    }
    return [];
  };

  payload.Bases = serializeRelatedField(getCategoryItems("bases"));
  payload.Liqueurs = serializeRelatedField(getCategoryItems("liqueurs"));
  payload.Alcohols = serializeRelatedField(getCategoryItems("alcohols"));
  payload.Ingredients = serializeRelatedField(getCategoryItems("ingredients"));

  return payload;
};

export const buildCocktailFormData = (cocktail) => {
  const payload = buildCocktailPayload(cocktail);
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }
    formData.append(key, value);
  });

  return formData;
};
