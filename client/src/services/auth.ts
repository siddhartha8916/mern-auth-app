/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery } from "@tanstack/react-query";
import apiPaths from "@/config/api-paths";
import { apiClient } from "@/lib/api-client";

const registerUser = async ({
  body: { username, email, password },
}: {
  body: { username: string; email: string; password: string };
}): Promise<any> => {
  const response = await apiClient.post(apiPaths.REGISTER, {
    username,
    email,
    password,
  });

  return response;
};

export const useRegister = () => {
  return useMutation(registerUser);
};

const loginUser = async ({
  body: { email, password },
}: {
  body: { email: string; password: string };
}): Promise<any> => {
  const response = await apiClient.post(
    apiPaths.LOGIN,
    {
      email,
      password,
    },
    {},
    { withCredentials: true }
  );

  return response;
};

export const useLogin = () => {
  return useMutation(loginUser);
};
