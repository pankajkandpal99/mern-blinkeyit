export const summaryApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgot_password: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  verify_otp: {
    url: "/api/user/verify-forgot-password-otp",
    method: "put",
  },
  reset_password: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refresh_token: {
    url: "/api/user/refresh-token",
    method: "post",
  },
  fetchUserDetails: {
    url: "/api/user/user-details",
    method: "get",
  },
  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  updateUser: {
    url: "/api/user/update-user",
    method: "put",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "post",
  },
  addCategory: {
    url: "/api/category/add-category",
    method: "post",
  },
  fetchCategory: {
    url: "/api/category/fetch-category",
    method: "get",
  },
  updateCategory: {
    url: "/api/category/update-category",
    method: "put",
  },
  deleteCategory: {
    url: "/api/category/delete-category",
    method: "delete",
  },
  addSubCategory: {
    url: "/api/subCategory/add-subCategory",
    method: "post",
  },
  fetchSubCategory: {
    url: "/api/subCategory/fetch-subCategory",
    method: "get",
  },
  updateSubCategory: {
    url: "/api/subCategory/update-subCategory",
    method: "put",
  },
  deleteSubCategory: {
    url: "/api/subCategory/delete-subCategory",
    method: "delete",
  },
  createProduct: {
    url: "/api/product/create",
    method: "post",
  },
  fetchProduct: {
    url: "/api/product/fetch",
    method: "get",
  },
  fetchProductByCategory: {
    url: "/api/product/fetch-product-by-category", // add categoryId after fetch....
    method: "get",
  },
  fetchProductByCatAndSubCat: {
    url: "/api/product/fetchProductByCatAndSubCat",
    method: "get",
  },
  fetchProductDetails: {
    url: "/api/product/fetch-product-details", // add categoryId after fetch....
    method: "get",
  },
  updateProduct: {
    url: "/api/product/update",
    method: "put",
  },
  deleteProduct: {
    url: "/api/product/delete",
    method: "delete",
  },
  fetchProductBySearch: {
    url: "/api/product/fetch/search",
    method: "get",
  },
  addToCart: {
    url: "/api/cart/create",
    method: "post",
  },
  fetchItemsFromCart: {
    url: "/api/cart/fetch",
    method: "get",
  },
  updateItemInCart: {
    url: "/api/cart/update",
    method: "put",
  },
  deleteItemInCart: {
    url: "/api/cart/delete",
    method: "delete",
  },
  createAddress: {
    url: "/api/address/create",
    method: "post",
  },
  fetchAddress: {
    url: "/api/address/fetch",
    method: "get",
  },
  updateAddress: {
    url: "/api/address/update",
    method: "put",
  },
  deleteAddress: {
    url: "/api/address/delete",
    method: "delete",
  },
  createCODOrder: {
    url: "/api/order/create",
    method: "post",
  },
  createOnlineOrder: {
    url: "/api/order/create",
    method: "post",
  },
  fetchOrderByUserId: {
    url: "/api/order/fetch",
    method: "get",
  },
};
