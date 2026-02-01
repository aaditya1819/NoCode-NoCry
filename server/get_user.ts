import prisma from "./lib/prisma.js";

async function check() {
    const users = await prisma.user.findMany();
    users.forEach(u => console.log(`USER: ${u.name} | ID: ${u.id} | Email: ${u.email}`));
}

check().catch(console.error);
