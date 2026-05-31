const mongoose=require('mongoose')


// const connection=mongoose.connect(`mongodb://127.0.0.1/propertymanagement`)
const connection=mongoose.connect(`mongodb+srv://twdnightowl_db_user:m3GTcSuQCLhi7jDL@cluster0.jjj7d4g.mongodb.net`)


module.exports=connection