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

  payload.Bases = serializeRelatedField(cocktail.bases || cocktail.Bases);
  payload.Liqueurs = serializeRelatedField(cocktail.liqueurs || cocktail.Liqueurs);
  payload.Alcohols = serializeRelatedField(cocktail.alcohols || cocktail.Alcohols);
  payload.Ingredients = serializeRelatedField(cocktail.ingredients || cocktail.Ingredients);

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
