import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { register } from "../api/register";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,

    onSuccess: () => {
      navigate("/login");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Registration error:", error.response?.data);
      }
    },
  });
}
