require('dotenv').config();
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const _=require("lodash");
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true});
const bodyParser=require("body-parser");
//const date=require(__dirname + "/date.js"); uncmnt lter
app.use(bodyParser.urlencoded({extended: true})); 
const itemsSchema={
    name:String
};
const Item=mongoose.model("Item",itemsSchema);
const item1 = new Item({
name:"Welcome to your to-do List!"
});
const item2 = new Item({
    name:"Hit + button to add new Task"
    });
    const item3 = new Item({
        name:"Check the Checkbox when its done."
        });
const defaultItems=[item1,item2,item3];
const listSchema={
    name:String,items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);

// const items=[];
// const workitems=[]; /* we can change array is. push in it but not assign it to different object also for objects we can keep them const and change the value of the keys in the object*/

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.get("/",function(req,res){
   // let day=date.getDate(); uncmnt later
   Item.find({},function(err,foundItems){
       if(foundItems.length === 0)
       {
        Item.insertMany(defaultItems,function(err){
            if(err){
            console.log(err);}
            else
            console.log("Done!!!!");
        });
        res.redirect("/");
       }
       else{
        res.render("list",{
            listTitle: "Today",newListitems : foundItems
        });
       }
    
        
    });
   
    });
 app.post("/",function(req,res){
    let itemName=req.body.newitem;
    const listName=req.body.list;
const item=new Item({
    name:itemName
});
if(listName === "Today")
{item.save();
res.redirect("/");}else{
    List.findOne({name:listName},function(err,foundList){
foundList.items.push(item);
foundList.save();
res.redirect("/"+listName);
    });
}
});
app.post("/delete",function(req,res){
const checkedItemId=req.body.checkbox;
const listName=req.body.listName;
if(listName === "Today")
{Item.findByIdAndRemove(checkedItemId,function(err){
    if(err)
    console.log(err);
    else
    console.log("Deleted");
});
res.redirect("/"); }
else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
        if(!err)
        res.redirect("/"+listName);
    });
}

});
// app.get("/work",function(req,res){
// res.render("list",{
// listTitle:"Work List",newListitems: workitems
// }); });
app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
if(!err)
{if(!foundList) 
{
    const list=new List({
        name:customListName,
        items:defaultItems
    });
    list.save();
    res.redirect("/"+ customListName);
}
else{
    res.render("list",{listTitle:foundList.name,newListitems:foundList.items});

}}
    });
    
    //res.redirect("/");

    });
    let port = process.env.PORT;
    if (port == null || port == "") {
      port = 3000;
    }
    app.listen(port);