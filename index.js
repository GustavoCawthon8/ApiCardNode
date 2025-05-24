require("dotenv").config();
const express = require('express');
const chalk = require("chalk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const UserCard = require("./src/models/UserCard");
const db = require('./src/config/db');
const UserAuth = require("./src/models/UserAuth");
const verifyToken = require("./src/middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


app.post("/users/create",verifyToken, async(req, res)=>{
  const name = req.body.name;
  const cargo = req.body.cargo;
  const descricao = req.body.descricao;
  await UserCard.create({name, cargo, descricao});
  res.json({ message: "Ação concluída com sucesso" });
})
app.get("/users/:id",verifyToken, async(req, res)=>{
  const id = req.params.id;
  const user = await UserCard.findOne({where: {id}, raw: true});
  res.json({user: user});
})


app.post("/deletar/user/:id",verifyToken, async(req, res)=>{
  const id = req.params.id;
  await UserCard.destroy({where: {id}});
  res.json({ message: "Ação concluída com sucesso" });
})

app.post("/users/update",verifyToken, async(req, res)=>{
  const id = req.body.id;
  const name = req.body.name;
  const cargo = req.body.cargo;
  const descricao = req.body.descricao;

  const userData = {
      id,
      name,
      cargo,
      descricao
  }
  await UserCard.update(userData, {where:{id: id}});
  res.json({ message: "Ação concluída com sucesso" });
})

app.get("/users/edit/:id",verifyToken, async(req, res)=>{
  const id = req.params.id;
  const user = await UserCard.findOne({where: {id}, raw: true});
  res.json({user: user});
})

app.post('/auth/register', async(req, res)=>{
  const {email, password} = req.body;
  const UserExists = await UserAuth.findOne({where: {email}});
  const hashedPassword = await bcrypt.hash(password, 10);

  if(UserExists){
    return res.status(400).json({message: "Email ja existe"});
  }

  await UserAuth.create({email, password: hashedPassword});
  res.status(201).json({message: "Usuario criado com sucesso"});
});

app.post('/auth/login', async(req, res)=>{
  const {email, password} = req.body;
  const user = await UserAuth.findOne({where:{email}});
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
 
  if (!passwordMatch) {
    return res.status(401).json({ message: "Senha incorreta" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: "Login realizado", token });
});

app.get("/painel",verifyToken, async(req, res)=>{
  const usercard = await UserCard.findAll({raw: true});
  res.json(usercard);
})

db.sync().then(()=>{
  /*
  app.listen(PORT, ()=>{
    console.log(chalk.bgGreenBright(`Servidor rodando na porta http://localhost:${PORT}`))
  })*/
    console.log(chalk.bgGreenBright("Banco de dados arrumado"))
 
}).catch(err => console.log(err));

module.exports = app;