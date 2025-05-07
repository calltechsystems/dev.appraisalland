export const handleResponseData = (response, router) => {
    if (response.userData.userType === 7) {
        router.push("/appraiser-company-dashboard-admin");
      } else if (
        response.userData.userType === 1 ||
        response.userData.userType === 6
      ) {
        router.push("/my-dashboard");
      } else if (response.userData.userType === 4) {
        router.push("/appraiser-company-dashboard");
      } else if (
        response.userData.userType === 3 ||
        response.userData.userType === 5
      ) {
        router.push("/appraiser-dashboard");
      } else if (response.userData.userType === 2) {
        router.push("/brokerage-dashboard");
      }
}