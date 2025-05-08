export const handleResponseData = (response, router) => {
  localStorage.setItem("user", JSON.stringify(response));
  if (response.userType === 7) {
    router.push("/appraiser-company-dashboard-admin");
  } else if (response.userType === 1 || response.userType === 6) {
    router.push("/my-dashboard");
  } else if (response.userType === 4) {
    router.push("/appraiser-company-dashboard");
  } else if (response.userType === 3 || response.userType === 5) {
    router.push("/appraiser-dashboard");
  } else if (response.userType === 2) {
    router.push("/brokerage-dashboard");
  }
};
