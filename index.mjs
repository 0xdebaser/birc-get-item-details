// This lambda function queries Square for the item details based on an id

import { Client, Environment, ApiError } from "square";

export const handler = async (event, context, callback) => {
  let responseObject;
  let client;

  try {
    if (!client)
      client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: Environment.Production,
      });
    const { catalogApi } = client;

    const data = await JSON.parse(event.body);
    const id = data.id;

    const res = await catalogApi.retrieveCatalogObject(id);

    responseObject = {
      result: "success",
      data: res.result,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log("Unexpected error occurred: ", error);
    }
    responseObject = {
      result: "failure",
      message: error.message,
    };
  }
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(
      responseObject,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged),
    ),
  };

  callback(null, response);
};
