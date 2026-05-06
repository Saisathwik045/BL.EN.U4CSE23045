import axios from "axios";

const BASE_URL = "http://20.207.122.201/evaluation-service";

const CREDENTIALS = {
  email: "bl.en.u4cse23045@bl.students.amrita.edu",
  name: "Sai Sathwik Regula",
  rollNo: "BL.EN.U4CSE23045",
  accessCode: "PTBMmQ",
  clientID: "ba0aec59-d9db-489e-ab78-007a268fb82b",
  clientSecret: "fNhfqPTDBeFskEAP",
};

let cachedToken: string | null = null;

export async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await axios.post(`${BASE_URL}/auth`, CREDENTIALS);
  cachedToken = res.data.access_token;
  return cachedToken as string;
}

export { BASE_URL };
