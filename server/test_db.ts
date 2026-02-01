import prisma from "./lib/prisma.js";

async function testConnection() {
    console.log("⏳ Testing Database Connection...");
    try {
        const userCount = await prisma.user.count();
        console.log(`✅ Database Connected! Total Users: ${userCount}`);

        const projectCount = await prisma.websiteProject.count();
        console.log(`✅ Total Projects: ${projectCount}`);

        // Check for specific project from screenshot
        const latestProject = await prisma.websiteProject.findFirst({
            orderBy: { createdAt: 'desc' }
        });
        console.log("📝 Latest Project:", {
            id: latestProject?.id,
            name: latestProject?.name,
            hasCode: !!latestProject?.current_code
        });

    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
