

const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

(async function seeding() {
  try {
    await database.category.createMany({
      data: [
        { name : "Computer Science"},
        { name : "Filming"},
        { name : "Photography"},
        { name : "Fitness"},
        { name : "Accounting"},
        { name : "Engineering"},
        { name : "Music"},
      ]
    });
    console.log("Success");
  } catch(error) {
    console.log("Error in seeding the categories", error);
  } finally {
    database.$disconnect();
  }
})(); 