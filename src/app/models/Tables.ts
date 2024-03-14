import { model, Schema } from "mongoose";

export const Table = model("Table",
  new Schema({
    name: {
      type: String,
      required: true,
    },
  })
);
