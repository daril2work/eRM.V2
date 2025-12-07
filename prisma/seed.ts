import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: hashedPassword,
            nama: "Administrator",
            role: "admin",
            active: true,
        },
    });

    console.log("Admin user created:", admin.username);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
