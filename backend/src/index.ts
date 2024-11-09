import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport, { use } from 'passport';
import cors from 'cors';
import { PrismaClient, User } from '@prisma/client'; // Import Prisma Client
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { createServer } from 'http';
import { Server } from 'socket.io';
dotenv.config();

const app = express();
const prisma = new PrismaClient(); // Create a Prisma Client instance



app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true, // allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // allowed headers
}));

const httpserver=createServer(app);

const io=new Server(httpserver,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true,
        methods:["GET","POST"]
    }
});


interface PlayerProgress {
    x: number ;
    y: number;
    elapsedTime: number;
    penalities: number;
    Level: any;
    userId?: number; // Optional initially, if not already set
}

let res:PlayerProgress;

io.on('connection',(socket)=>{

    console.log("Socket connected with userId: ",socket.id);

   socket.on("myEvent",(data)=>{
    res=data;
    console.log(res);
   })
      
   socket.on('disconnect',async()=>{
    try {
        const {x,y,elapsedTime, penalities, Level,userId}=res ;
        console.log(typeof x );
        console.log(x);

    if (!userId || !Level) {
        throw new Error("userId and Level must be defined");
    }

    console.log("last time :" ,res);

    const updatedValue=  await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            Level,
            x,
            y,
            onGoingTime:elapsedTime,
            penalities:penalities,
            levels:{
                upsert:{
                    where:{
                        userId_levelName:{
                            userId:userId ,
                            levelName:Level
                        }
                    },update:{
                        x,
                        y,
                        onGoingTime:elapsedTime,
                        penalities:penalities,
                    },
                    create:{

                        levelName: Level,
                        x,
                        y,
                        onGoingTime:elapsedTime,
                        penalities:penalities,
                    }
                }
            }
        }
    })
    console.log(updatedValue);  
    return ;
    } catch (error) {
        console.log(error);
        return ;
    }
    
    })

})

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID || "",
    clientSecret: process.env.CLIENT_SECRET || "",
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findFirst({
            where: { googleID: profile.id }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleID: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || "",
                    photo: profile.photos?.[0]?.value || "",
                    verified: true
                }
            });
        }

        return done(null, user  );
    } catch (error) {
        return done(error, undefined);
    }
}));


passport.serializeUser((user , done) => {
    done(null, user );
});

passport.deserializeUser((user : User, done) => {
    done(null, user );
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req , res: Response) => {
        if (req.user) {
            const user = req.user as User;
            const verified = user.verified;
            const id=user.id;
            const ID=jwt.sign({id} ,process.env.JWT_SECRET || ""); //use  id instead of verified later for more security 
            const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || "");
            res.redirect(`http://localhost:5173/play?verified=${encodeURIComponent(token)}&userName=${encodeURIComponent(user.name)}`);
        } else {
            res.redirect('/'); // Handle the case where user is undefined
        }
    }
);

app.get('/', (req, res) => {
    res.send("Error while signing In");
});


interface CustomRequest extends Request {
    userId?: { id: number };
    userName?:{name:string};
}


 const checkUser=(req: CustomRequest, res: Response, next: NextFunction)=>{
    try{
       
    const token=req.headers.authorization || "";
    console.log("T: ",token);
    const user=jwt.verify(token,process.env.JWT_SECRET || "") as { id: number, name:string } ;
    if(!user){
             res.status(409).send("Invalid user");
             return ;
    }
    else{       
        const id:number=user.id;
        const name:string =user.name;
        const userId={id};
        const userName={name};
        req.userName=userName;
        req.userId=userId;  
        console.log("NEXT: ");
        next();
        }
    }
    catch(e){
         res.status(411).send("Wrong user");
         return ;

    }
}
app.get('/auth', checkUser ,(req:CustomRequest, res:Response) => {
    const userId=req.userId?.id;
    const name=req.userName?.name;
    console.log(name,userId);
   res.send({userId,name,isValid:true});
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'manubhushan1234@gmail.com',
        pass: process.env.EMAIL_SECRET // Use an App Password if 2FA is enabled
    }
});

app.get("/auth/verifyOtp/:otp", async (req, res) => {
    try {

        const otp = req.params.otp;
        const email = req.query.email as string; // Ensure email is of type string

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            res.status(400).send("Invalid User");
            return;
        }
        if (user.verificationCode === -1) {
            res.status(411).send("You have not logged in using verify otp");
            return;
        }
        if (Number(otp) !== user.verificationCode) {
            res.status(411).send("Wrong otp");
            return;
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { verified: true }
        });

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email , Level:user.Level}, process.env.JWT_SECRET || "");
        res.status(200).send({ token: token });
    } catch (error) {
        res.status(411).send("error");
    }
});

app.post("/auth/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        let user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            res.status(400).send("User already Exist");
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
            from: 'manubhushan1234@gmail.com',
            to: email,
            subject: 'Verification code for SignUp on Phaser Force',
            text: String(otp),
            html: String(otp),
        };

        await transporter.sendMail(mailOptions);
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                email,
                verificationCode: otp,
            }
        });

        
        res.status(200).send("Email sent successfully");
    } catch (e) {
        res.status(411).send("Error while signing Up");
    }
});

app.post("/auth/local", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(400).json({ message: "User not found" });
        } else {
            if (!user.password) {
                res.status(400).json({
                    message: "This email is registered via Google. Please use Google sign-in."
                });
                return;
            } else {
                if (!user.verified) {
                    const otp = Math.floor(100000 + Math.random() * 900000);
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { verificationCode: otp }
                    });
                   
                    const mailOptions = {
                        from: 'manubhushan1234@gmail.com',
                        to: email,
                        subject: 'Verification code for SignUp on Phaser Force',
                        text: String(otp),
                        html: String(otp),
                    };

                    await transporter.sendMail(mailOptions);
                    res.status(409).send("Your Email is not verified. Verify your email");
                    return;
                }
                const result = await bcrypt.compare(password, user.password);
                if (!result) {
                    res.status(411).json({ message: "Wrong password" });
                } else {
                    const token = jwt.sign({ id: user.id, name: user.name, email: user.email , Level:user.Level}, process.env.JWT_SECRET || "");
                    res.status(200).send({ token: token });
                }
            }
        }
    } catch (error) {
        res.status(411).send("Error while login user");
    }
});

    app.put("/newgame",checkUser,async(req:CustomRequest,res)=>{
        try {

            const userId=req.userId?.id   

            const user=await prisma.user.update({
                where:{
                id:Number(userId)
                },
                data:{
                    isCompleted:false,
                    x:800,
                    y:1550,
                    penalities:0,
                    onGoingTime:0,
                    Level:"Level1",
                    levels:{
                        updateMany:{
                            where:{
                                userId:Number(userId)
                            },
                            data:{
                                SPI:0,
                                penalities:0,
                                onGoingTime:0,
                            }
                        }
                    }
                },select:{
                    x:true,
                    y:true,
                    isCompleted:true,
                    Level:true
                }
             
            })
            // do not change the CPI when the game will get comp take the avg of all the bestSPI and 
            // put CPI =  max(CPI ,  Avg of bestSPI )
            console.log(user);
            res.send(user);
            
            return ;
            
        } catch (error) {
                res.status(409).send("Error while making new game");
        }
    });


app.get("/resume",checkUser,async(req:CustomRequest,res)=>{
    try {
        const userId=req.userId?.id;    

        const user=await prisma.user.findUnique({
            where:{
                id:Number(userId),
            },
            select:{
                Level:true,
                x:true,
                y:true,
                onGoingTime:true,
                penalities:true
            }
        }); 
        // user level will be null if all the levels are comp
        console.log("UUUUUU: ",user);
        res.send(user);
        return ;

    }
    catch(e){
        res.status(411).send("Error while fetching the current level");
        return ;
    }
});

app.get("/leaderboard",async(req,res)=>{
    try {
            const winners=await prisma.user.findMany({
                where:{
                    isCompleted:true,                    
                }
                , select:{
                    CPI:true,
                    name:true,
                },
                orderBy:[{ CPI:'desc'}, // to get the highest cpi at the top
                    {createdAt:'asc'}
                ]
                   
                
            })
            console.log(winners);
            res.send(winners);
            return ;
    } catch (error) {
             res.status(400).send("Error while fetching winners");
             return ;
    }
});

enum LevelName {
    Level1 = "Level1",
    Level2 = "Level2",
    Level3 = "Level3",
    Level4 = "Level4",
    Level5 = "Level5",
  }

app.get("/level-leaderboard/:levelName",checkUser,async(req:CustomRequest,res)=>{
    try {
        const userId = req.userId?.id;
        const { levelName } = req.params;
    
        // Check if levelName is valid and matches an enum value
        if (!(levelName in LevelName)) {
          // If it's not a valid enum value, send an error response
           res.status(400).send({ message: "Invalid level name" });
           return ;
        }
    
        // If levelName is valid, proceed with querying the database
        const winners = await prisma.level.findMany({
          where: {
            isComp: true,
            levelName: levelName as LevelName, // Cast levelName to LevelName enum
          },
          select: {
            bestSPI: true,
            user: {
              select: {
                name: true,
                id:true,
              },
            },
          },
          orderBy:{
            bestSPI:"desc"
          }
        });
    
        console.log("WW: ", winners);
        res.send(winners);
        return;
      } catch (error) {
        res.status(400).send("Error while fetching winners");
        return;
      }
});

app.get("/complevel",checkUser,async(req:CustomRequest,res:Response)=>{
    try{

        const userId=req.userId?.id;
        const level=await prisma.level.findMany({
            where:{
                userId
            },
            select:{
                levelName:true,
                isComp:true,
                bestSPI:true,
                SPI:true,

            }
        })
        console.log(level);
        res.send(level);
        return ;
    }
    catch(e){
        res.status(400).send("Error while fetching the completed levels");
        return;
         
    }
})

app.post("/level-complete",checkUser,async(req:CustomRequest,res)=>{

    try {
        
    const userId = Number(req.userId?.id);

    const {  SPI, Level } = req.body;
    let nextLevel;

    if (Level === "Level1") {
    nextLevel = "Level2";
    } else if (Level === "Level2") {
    nextLevel = "Level3";
    } else if (Level === "Level3") {
    nextLevel = "Level4";
    } else if (Level === "Level4") {
    nextLevel = "Level5"; 
    }
    else if(Level==="Level5"){
        nextLevel  =null // all the levels are comp
    }


    console.log("NextLevel"  , nextLevel);

    let existingLevel;
    
    if(nextLevel){
         existingLevel = await prisma.level.findMany({
            where: {
                userId,
                levelName: {
                    in:[nextLevel,Level]
                },
            }
        });
    }
    else{
         existingLevel = await prisma.level.findMany({
            where: {
                userId,
                levelName: Level
                ,
            }
        });
    }
    

    console.log("Before : ",existingLevel);
  
    const sortedLevels = existingLevel.sort((a, b) => {
        if (a.levelName === Level) return -1; // Place `Level` first
        if (b.levelName === Level) return 1;
        return 0;
      });
    
      console.log("After : ",sortedLevels);
      
  if (sortedLevels[0]) {

    if (!sortedLevels[0].isComp && nextLevel ) {
      // Update only if `isComp` is not true

      const user=await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            Level:nextLevel,
            levels:{
                update:{
                    where:{
                        userId_levelName: {
                            userId,
                           levelName: Level, // Assuming Level is passed in as a string that matches LevelName enum
                         },
                    },
                    data:{
                        SPI:Number(SPI),
                        bestSPI:Number(SPI),
                        isComp:true
                    }
                }
            }
        },
        include: {
            levels: true
          },
        });
        // send penalties and elap. time
      res.send({nextLevel,onGoingTime:sortedLevels[1]? sortedLevels[1].onGoingTime:0 ,penalities:sortedLevels[1]? sortedLevels[1].penalities:0});
      return ;
      
    } else if(!sortedLevels[0].isComp && !nextLevel) {
        // player has comp the last level 
        
        const user=await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                Level:"Level1",
                isCompleted:true,
                levels:{
                    update:{
                        where:{
                            userId_levelName: {
                                userId,
                               levelName: Level,
                             },
                        },
                        data:{
                            SPI:Number(SPI),
                            bestSPI:Number(SPI),
                            isComp:true
                        }
                    }
                }
            }
            ,include:{
                levels:true,
            }
          })

          const totalSPI = user.levels.reduce((acc, level) => acc + level.bestSPI, 0);

          const averageSPI = user.levels.length > 0 ? totalSPI / user.levels.length : 0;
          
         const result= await prisma.user.update(  {
                where:{
                    id:userId
                },data:{
                    CPI:averageSPI
                }
            }
          )
          res.send({nextLevel,onGoingTime:sortedLevels[1]? sortedLevels[1].onGoingTime:0 ,penalities:sortedLevels[1]? sortedLevels[1].penalities:0});
          return;
    } 
    else  if(sortedLevels[0].isComp){
        // player has already comp this level once so assign the bestSPI as the 
        if(SPI<=sortedLevels[0].bestSPI){
            // dont do anything
            const user=  await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    levels:{
                        update:{
                            where:{
                                userId_levelName: {
                                    userId,
                                    levelName: Level,
                                }
                            },
                            data:{
                              isComp:true
                            }
                        }
                    }
                },
            })
            res.send({nextLevel,onGoingTime:sortedLevels[1]? sortedLevels[1].onGoingTime:0 ,penalities:sortedLevels[1]? sortedLevels[1].penalities:0});
            // send the level info of the user which he has completed
            return ;
           
        }
       else if(SPI >= 7.5 && sortedLevels[0].bestSPI<7.5 ){
            // bestspi =7.5
            enum LevelName {
                Level1 = "Level 1",
                Level2 = "Level 2",
                Level3 = "Level 3",
                Level4 = "Level 4",
                Level5 = "Level 5",
              }

          const user=  await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    levels:{
                        update:{
                            where:{
                                userId_levelName: {
                                    userId,
                                    levelName: Level,
                                }
                            },
                            data:{
                                SPI:SPI,
                                bestSPI:7.5,
                              isComp:true
                            }
                        }
                    }
                },
                include:{
                    levels:{
                        where:{
                            userId:userId,
                        },select:{
                            levelName:true,
                            onGoingTime:true,
                            penalities:true
                        }
                    }
                }
            })
            res.send({nextLevel,onGoingTime:sortedLevels[1]? sortedLevels[1].onGoingTime:0 ,penalities:sortedLevels[1]? sortedLevels[1].penalities:0});
            return ;
        }
        else if(SPI>sortedLevels[0].bestSPI && sortedLevels[0].bestSPI<7.5 ){
            //bestspi= spi
           const user= await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    levels:{
                        update:{
                            where:{
                                userId_levelName: {
                                    userId,
                                    levelName: Level,
                                }
                            },
                            data:{
                                bestSPI:SPI
                            }
                        }
                    }
                }
            })
            res.send({nextLevel,onGoingTime:sortedLevels[1]? sortedLevels[1].onGoingTime:0 ,penalities:sortedLevels[1]? sortedLevels[1].penalities:0});
            return ;
        }
       
    }
    
  } else {
    // If no existing record, create a new one

        if (nextLevel) {
        // Update only if `isComp` is not true

        // completes the existing level in one go (first attempt) 
        const user=await prisma.user.update({
          where:{
              id:userId
          },
          data:{
              Level:nextLevel,
              levels:{
                  create:{
                        levelName: Level,
                          SPI:Number(SPI),
                          bestSPI:Number(SPI),
                          isComp:true
                  }
              }
          }
          ,include:{
              levels:true,
          }
        })
        console.log(user);
        
        res.send({nextLevel,onGoingTime:0,penalities:0});
        return ;
        
      } 
      else if(!nextLevel){ // only one level in game
        // next level do not exist player has comp the last level in 1 go

        const user=await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                Level:"Level1",
                isCompleted:true,
                levels:{
                    create:{
                        levelName: Level,
                        SPI:Number(SPI),
                        bestSPI:Number(SPI),
                        isComp:true
                    }
                }
            }
            ,include:{
                levels:true,
            }
          })

          const totalSPI = user.levels.reduce((acc, level) => acc + level.bestSPI, 0);

          const averageSPI = user.levels.length > 0 ? totalSPI / user.levels.length : 0;
          
          await prisma.user.update(  {
                where:{
                    id:userId
                },data:{
                    CPI:averageSPI
                }
            }  )

            res.send({nextLevel,onGoingTime:0,penalities:0});
            return ;
      }

  }
    
  }
  catch(e){
    res.status(411).send("Error while doing level complete calls");
    return;
  }
   
})



const PORT = process.env.PORT || 3000;
httpserver.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
