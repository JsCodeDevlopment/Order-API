import { CorsOptions } from "cors";

const whiteList = [
    "http://localhost:5173",
  ];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if ((origin && whiteList.includes(origin)) ?? !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };