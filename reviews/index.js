import { ApolloServer } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import { readFile } from "fs/promises";

const server = new ApolloServer({
  typeDefs: buildSubgraphSchema({
    typeDefs: parse(await readFile("schema.graphql", "utf-8")),
  }),
  mockEntireSchema: true,
});

const { url } = await server.listen(4000);
console.log(`reviews ${url}`);
