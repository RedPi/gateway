import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloGateway } from "@apollo/gateway";
import { readFileSync } from "fs";
import express from "express";
import cors from "cors";

(async () => {
  // internal graphql server
  const gateway = new ApolloGateway({
    supergraphSdl: readFileSync("./src/supergraph.graphqls", "utf8"),
  });
  const server = new ApolloServer({ gateway });
  await server.start();

  // http server
  const app = express();
  if (!process.env.HIDE_GRAPHQL_ENDPOINT) {
    app.use("/graphql", cors(), express.json(), expressMiddleware(server));
  }

  const port = 8080;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
