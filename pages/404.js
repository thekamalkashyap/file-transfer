import Router from "next/router";
import React from "react";

const Error = () => {
  React.useEffect(() => {
    Router.replace("/");
  });
  return null;
};
export default Error;
