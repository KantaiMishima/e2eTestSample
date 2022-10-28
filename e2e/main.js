// eslint-disable-next-line no-undef
fixture("open page");

test("open page", async (t) => {
  await t.maximizeWindow();

  // const baseUrl = process.env.BASE_URL;
  const baseUrl = "http://localhost:3000"
  await t.navigateTo(`${baseUrl}/`("/"));
});
