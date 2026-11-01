export const buildMaterialOptions = (items, useChinese) => {
  const primaryName = (item) =>
    useChinese ? (item.chinese_name || item.Chinese_Name) : (item.english_name || item.English_Name);
  const secondaryName = (item) =>
    useChinese ? (item.english_name || item.English_Name) : (item.chinese_name || item.Chinese_Name);
  const nameCounts = new Map();

  items.forEach((item) => {
    const name = primaryName(item);
    nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
  });

  return items.map((item) => {
    const name = primaryName(item);
    const label =
      nameCounts.get(name) > 1
        ? `${name} (${secondaryName(item)})`
        : name;

    return { value: item.id, label };
  });
};
