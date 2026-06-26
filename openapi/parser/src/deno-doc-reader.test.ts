import { getDenoDoc } from "./deno-doc-reader.ts";

Deno.test("getDenoDoc preserves Deno 2 enum members", async () => {
  const path = new URL("../../e2e/models/product-type.model.ts", import.meta.url).pathname;
  const docs = await getDenoDoc(path);

  if (!Array.isArray(docs)) {
    throw new Error("Expected getDenoDoc() to return an array of root definitions");
  }

  const enumDef = docs.find((doc) => doc.kind === "enum" && doc.name === "ProductTypeEnum");
  const memberNames = enumDef?.enumDef?.members?.map((member: { name: string }) => member.name);
  const expectedMemberNames = ["shop", "clothes", "education"];

  if (JSON.stringify(memberNames) !== JSON.stringify(expectedMemberNames)) {
    throw new Error(
      `Expected enum members ${JSON.stringify(expectedMemberNames)}, got ${JSON.stringify(memberNames)}`,
    );
  }
});
