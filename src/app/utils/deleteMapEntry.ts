export const deleteMapEntry = (map: any, key: any) => {
  const newMap = { ...map };
  delete newMap[key];
  return newMap;
};
