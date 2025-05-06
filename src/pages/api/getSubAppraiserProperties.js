import axios from "axios";

async function handler(request, response) {
  const domain = process.env.BACKEND_DOMAIN;
  const token = request.headers.authorization;

  try {
    // Pass noOfDays as a query param (default to 1000 if not provided)
    const noOfDays = request.query.noOfDays || 1000;

    const apiResponse = await axios.get(
      `${domain}/com.appraisalland.Admin/getSubAppraiserProperties`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          noOfDays,
        },
      }
    );

    const data = apiResponse.data;

    return response.status(200).json({ msg: "OK", data });
  } catch (err) {
    console.log(err);
    if (err.response) {
      const statusCode = err.response.status;
      const axiosError = err.response.data;
      console.error(statusCode, axiosError.message);

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
