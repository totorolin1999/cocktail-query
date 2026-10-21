export const buildCocktailPayload = (cocktail) => {
  const payload = { ...cocktail };

  const serializeRelatedField = (fieldValue) => {
    if (!fieldValue) return [];
    if (Array.isArray(fieldValue)) {
      return fieldValue.map((item) => ({ value: item?.value ?? item?.id ?? item }));
    }
    return [{ value: fieldValue?.value ?? fieldValue?.id ?? fieldValue }];
  };

  payload.Bases = serializeRelatedField(cocktail.Bases);
  payload.Liqueurs = serializeRelatedField(cocktail.Liqueurs);
  payload.Alcohols = serializeRelatedField(cocktail.Alcohols);
  payload.Ingredients = serializeRelatedField(cocktail.Ingredients);

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
