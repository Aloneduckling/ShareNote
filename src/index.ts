import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

dotenv.config();

//typescript types
type User = {
    email: string;
    password: string;
    username: string;
};

type Signin = {
    username: string;
    password: string;
};

type Note = {
    title: string;
    body: string;
    userId: string;
}

//clients
const User = prisma.user;
const Note = prisma.note;
const SharedNote = prisma.sharedNote;



const port = process.env.PORT || 3000;

app.get("/signup", async (req: Request, res: Response) => {
    try {
        const user: User = req.body;

        //check if the email and username are already taken
        const foundUser = await User.findFirst({
            where: {
                OR: [
                    {
                        email: user.email,
                    },
                    {
                        username: user.username,
                    },
                ],
            },
        });

        if (foundUser) {
            return res
                .status(409)
                .json({ message: "Email or username already in use" });
        }

        const newUser = await User.create({
            data: {
                ...user,
            },
        });

        const secret = process.env.JWT_SECRET?.toString();

		const token = jwt.sign({ username: user.username }, secret || 'default secret');

        return res
            .status(201)
            .json({ token, newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "interna server error" });
    }
});

app.post("/signin", async (req: Request, res: Response) => {
    try {
        const signinData: Signin = req.body;

        //check if the username exists or not
        const user = await User.findFirst({
            where: {
                username: signinData.username,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        //compare the passwords
        if (user.password !== signinData.password) {
            return res.status(401).json({ message: "incorrect password" });
        }

        const secret = process.env.JWT_SECRET?.toString();

        const token = jwt.sign(
            { username: user.username },
            secret || "default secret"
        );

        return res.json({ token, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
});

app.get("/users", async (req: Request, res: Response) => {
    try {
        const allUsers = await User.findMany();
        return res.json(allUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
});

// Note routes
app.get("/users/:userId/notes", async (req: Request, res: Response) => {
    try {
        //find the user
        const userId = req.params.userId;
        const user = await User.findFirst({
            where: {
                id: userId
            },
            select: {
                username: true,
                notes: true
            },
        });
        
        if(!user){
            return res.status(404).json({ message: "user not found" });
        }
        
        return res.json({ user });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
});


app.post('/users/:userId/notes', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const note: Note = req.body.note;
        const user = await User.findFirst({
            where: { id: userId }
        });

        if(!user){
            return res.status(404).json({ message: "user not found" });
        }

        const newNote = Note.create({
            data: {
                ...note
            }
        });

        return res.status(201).json({ message: "Note created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
    
});





app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
