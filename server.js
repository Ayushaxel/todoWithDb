const express = require("express");
const bodyParser = require("body-parser");
var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todo");
const trySchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("task", trySchema);
const todo = new Item({
  name: "create some videos",
});
todo.save();

app.get("/", async (req, res) => {
  const founditem = await Item.find();
  const showEditAlert = req.query.edited === "true";
  const deleteAlert = req.query.deleted === "true";
  res.render("index", { dayej: founditem, deleteAlert: deleteAlert,showAlert: showEditAlert,});
});
app.post("/", async (req, res) => {
  const newItem = req.body.name;
  const todo = new Item({
    name: newItem,
  });
  todo.save();
  res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Item.findByIdAndDelete(id);
  res.redirect("/?deleted=true");
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const itemToEdit = await Item.findById(id);
  const allItems = await Item.find();
  res.render("edit", { item: itemToEdit, dayej: allItems });
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const newName = req.body.name;
  await Item.findByIdAndUpdate(id, { name: newName });
  res.redirect("/?edited=true");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server started");
});
