export const generateValidUrl = (category, subCategory) => {
  if (!category || !subCategory) {
    console.error("Invalid category or subCategory");
    return "";
  }

  // Replace spaces in category and subCategory names with underscores
  const formattedCategoryName = category.name.replace(/[\s,]+/g, "_");
  const formattedSubCategoryName = subCategory.name.replace(/[\s,]+/g, "_");

  // Generate URL
  const url = `/${formattedCategoryName}-${category._id}/${formattedSubCategoryName}-${subCategory._id}`;

  return url;
};
