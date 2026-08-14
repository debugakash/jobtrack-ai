import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  return error.response?.data?.message || fallback;
}
