import prisma from "./config/prisma.js";

async function test() {
  await prisma.job.findMany();
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        