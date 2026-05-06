export const BASE_URL = "http://20.207.122.201/evaluation-service";

export const AUTH_CREDENTIALS = {
  email: "bl.en.u4cse23045@bl.students.amrita.edu",
  name: "Sai Sathwik Regula",
  rollNo: "BL.EN.U4CSE23045",
  accessCode: "PTBMmQ",
  clientID: "ba0aec59-d9db-489e-ab78-007a268fb82b",
  clientSecret: "fNhfqPTDBeFskEAP",
};

// Priority weights: higher = more important
export const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};
