import { Request, Response } from "express"
import prisma from "../lib/prisma.js"
import { generateWebsiteCode } from "../lib/aiService.js";
import razorpayInstance from "../configs/razorpay.js";
import crypto from "crypto";

// get user credits 
export const getUserCredits = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        if (!userId) return res.status(401).json({ message: "Unauthorized user" })
        const user = await prisma.user.findUnique({ where: { id: userId } })
        return res.json({ credits: user?.credits })
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
}

// Controller Function to create a new project
export const createUserProject = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    try {
        const { initial_prompt } = req.body;
        if (!userId) return res.status(401).json({ message: "Unauthorized user" })

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user && user.credits < 5) return res.status(403).json({ message: "Add credits to create more projects" })

        // 1. Create the project entry
        const project = await prisma.websiteProject.create({
            data: {
                name: initial_prompt.length > 50 ? initial_prompt.substring(0, 47) + "..." : initial_prompt,
                initial_prompt,
                userId: userId as string
            }
        })

        // 2. Create the User's first message IMMEDIATELY so it shows up on landing
        await prisma.conversation.create({
            data: { role: 'user', content: initial_prompt, projectId: project.id as string }
        })

        // 3. Return immediately so frontend redirects
        res.json({ projectId: project.id });

        // 4. Background AI generation
        (async () => {
            try {
                await prisma.user.update({ where: { id: userId as string }, data: { totalCreation: { increment: 1 }, credits: { decrement: 5 } } })

                // Request interactive generation
                const aiResponse = await generateWebsiteCode(initial_prompt, true);
                const { explanation, code } = aiResponse;

                const cleanCode = code.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim();

                const version = await prisma.version.create({
                    data: { code: cleanCode, description: 'Initial Version', projectId: project.id as string }
                });

                await prisma.conversation.create({
                    data: {
                        role: 'assistant',
                        content: explanation || "I've created your website!",
                        projectId: project.id as string
                    }
                });

                await prisma.websiteProject.update({
                    where: { id: project.id as string },
                    data: { current_code: cleanCode, current_version_index: version.id }
                });
            } catch (err: any) {
                console.error(`💥 [BACKGROUND ERROR]:`, err.message);
                // On failure, add an error message to chat
                await prisma.conversation.create({
                    data: { role: 'assistant', content: "I'm sorry, I ran into an error while building your site. Please try refreshing or requesting a specific change.", projectId: project.id as string }
                });
            }
        })();

    } catch (error: any) {
        return res.status(500).json({ message: error.message || "An unexpected error occurred" })
    }
}

// ... (rest of the controller stays the same)
export const getUserProject = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        const { projectId } = req.params;
        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId as string, userId: userId as string },
            include: {
                conversation: { orderBy: { timestamp: 'asc' } },
                versions: { orderBy: { timestamp: 'asc' } }
            }
        })
        return res.json({ project })
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
}

export const getUserProjects = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        const projects = await prisma.websiteProject.findMany({ where: { userId: userId as string }, orderBy: { updatedAt: 'desc' } })
        return res.json({ projects })
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
}

export const togglePublish = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        const { projectId } = req.params;
        const project = await prisma.websiteProject.findUnique({ where: { id: projectId as string, userId: userId as string } })
        if (!project) return res.status(404).json({ message: "Project not found" })
        const updatedProject = await prisma.websiteProject.update({ where: { id: projectId as string }, data: { isPublished: !project.isPublished } })
        return res.json({ message: updatedProject.isPublished ? 'Project Published' : 'Project Unpublished' })
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
}

// Razorpay Payment Integration
export const paymentRazorpay = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        const { planId } = req.body;

        if (!userId || !planId) {
            return res.status(400).json({ message: "Missing required details" });
        }

        const plans = {
            basic: { amount: 99, credits: 200 },
            pro: { amount: 299, credits: 1000 },
            enterprise: { amount: 799, credits: 5000 }
        };

        const plan = plans[planId as keyof typeof plans];
        if (!plan) return res.status(400).json({ message: "Invalid Plan" });

        // Create transaction in database
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                planId,
                amount: plan.amount,
                credits: plan.credits,
                isPaid: false
            }
        });

        const options = {
            amount: plan.amount * 100, // Razorpay works in paise
            currency: "INR",
            receipt: transaction.id
        };

        const order = await razorpayInstance.orders.create(options);
        return res.json({ success: true, order });

    } catch (error: any) {
        console.error("Razorpay Payment Error:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const verifyRazorpay = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
            const transactionId = orderInfo.receipt;

            const transactionData = await prisma.transaction.findUnique({ where: { id: transactionId as string } });

            if (!transactionData || transactionData.isPaid) {
                return res.status(400).json({ message: "Invalid Transaction" });
            }

            // Update user credits
            await prisma.user.update({
                where: { id: transactionData.userId },
                data: { credits: { increment: transactionData.credits } }
            });

            // Mark transaction as paid
            await prisma.transaction.update({
                where: { id: transactionId as string },
                data: { isPaid: true }
            });

            return res.json({ success: true, message: "Payment Successful. Credits added." });
        } else {
            return res.status(400).json({ success: false, message: "Payment Verification Failed" });
        }

    } catch (error: any) {
        console.error("Razorpay Verification Error:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const PurchaseCredits = async (req: Request, res: Response) => { }
