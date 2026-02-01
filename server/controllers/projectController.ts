import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { generateWebsiteCode } from "../lib/aiService.js";

// Controller function to make revision
export const makeRevision = async (req: Request, res: Response) => {
    const userId = req.userId as string;

    try {
        const { projectId } = req.params;
        const { message } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!userId || !user) return res.status(401).json({ message: "Unauthorized user" });
        if (user.credits < 5) return res.status(403).json({ message: "Add credits to make changes" });
        if (!message || message.trim() === '') return res.status(400).json({ message: "Please provide a valid message" });

        const currentProject = await prisma.websiteProject.findUnique({
            where: { id: projectId as string, userId: userId as string },
            include: { versions: true }
        });

        if (!currentProject) return res.status(404).json({ message: "Project not found" });

        await prisma.conversation.create({ data: { role: 'user', content: message, projectId: projectId as string } });
        await prisma.user.update({ where: { id: userId as string }, data: { credits: { decrement: 5 } } });

        const combinedPrompt = `Update the current code based on this request: "${message}"\nCURRENT CODE:\n${currentProject.current_code || "No code yet"}`;

        try {
            // Interactive generation
            const aiResponse = await generateWebsiteCode(combinedPrompt, false);
            const { explanation, code } = aiResponse;
            console.log("✅ Received Code Length:", code.length);

            const cleanCode = code.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim();

            const version = await prisma.version.create({
                data: { code: cleanCode, description: message.substring(0, 50), projectId: projectId as string }
            });

            await prisma.conversation.create({
                data: {
                    role: 'assistant',
                    content: explanation || `I've updated your website based on your request.`,
                    projectId: projectId as string
                }
            });

            await prisma.websiteProject.update({
                where: { id: projectId as string },
                data: { current_code: cleanCode, current_version_index: version.id }
            });

            return res.json({ message: 'Changes made successfully' });
        } catch (aiError: any) {
            await prisma.conversation.create({ data: { role: 'assistant', content: `Revision failed: ${aiError.message}`, projectId: projectId as string } });
            await prisma.user.update({ where: { id: userId as string }, data: { credits: { increment: 5 } } });
            return res.status(500).json({ message: aiError.message });
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "An unexpected error occurred" });
    }
};

export const rollBackToVersion = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    try {
        const { projectId, versionId } = req.params;
        const project = await prisma.websiteProject.findUnique({ where: { id: projectId as string, userId: userId as string }, include: { versions: true } });
        if (!project) return res.status(404).json({ message: "Project not found" });
        const version = (project.versions as any[]).find((v: any) => v.id === versionId);
        if (!version) return res.status(404).json({ message: "Version not found" });
        await prisma.websiteProject.update({ where: { id: projectId as string }, data: { current_code: version.code, current_version_index: version.id } });
        return res.json({ message: 'Version rolled back' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        await prisma.websiteProject.delete({ where: { id: projectId as string } });
        return res.json({ message: 'Project deleted successfully' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProjectPreview = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.websiteProject.findUnique({ where: { id: projectId as string }, include: { versions: true } });
        return res.json({ project });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getPublishedProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.websiteProject.findMany({ where: { isPublished: true }, include: { user: true } });
        return res.json({ projects });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.websiteProject.findFirst({ where: { id: projectId as string } });
        if (!project || !project.current_code) return res.status(404).json({ message: "Project not found" });
        return res.json({ code: project.current_code });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const saveProjectCode = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const { code } = req.body;
        await prisma.websiteProject.update({ where: { id: projectId as string }, data: { current_code: code } });
        return res.json({ message: 'Project saved successfully' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
