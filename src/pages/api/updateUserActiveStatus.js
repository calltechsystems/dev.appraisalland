import axios from "axios";

export default async function handler(request, response) {
  const domain = process.env.BACKEND_DOMAIN;
  try {

    const { id,IsActive } = request.body;

    const token = request.headers.authorization;

  
    const userResponse = await axios.post(
      `${domain}/com.appraisalland.Admin/updateUserActivationStatus`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params:{
            userId:id,
            isActive:IsActive
        }
      }
    );
    const user = userResponse.data;

    return response.status(201).json({ msg: "Successfully Created !!" });
  } catch (err) {
    console.log({err});
    if (err.response) {
      // If the error is from an axios request (e.g., HTTP 4xx or 5xx error)
      
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.error(statusCode, axiosError.message); // Log the error for debugging

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      // Handle other types of errors
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
