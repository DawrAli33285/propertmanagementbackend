const express=require('express')
const app=express();
const connection=require('./connection/connection')
const cors=require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.json())

const authRoutes=require('./routes/auth')
const contractorRoutes=require('./routes/contractor')
const contractorassignmentRoutes=require('./routes/contractorassignment')
const notificationRoutes=require('./routes/notification')
const propertyRoutes=require('./routes/property')
const tenantRoutes=require('./routes/tenant')
const ticketRoutes=require('./routes/ticket')
const ticketmediaRoutes=require('./routes/ticketmedia')
const ticketnoteRoutes=require('./routes/ticketnote')
const unitRoutes=require('./routes/unit')
const userRoutes=require('./routes/user')

app.use('/auth',                    authRoutes)
app.use('/contractors',             contractorRoutes)
app.use('/notifications',           notificationRoutes)
app.use('/properties',              propertyRoutes)
app.use('/tenants',                 tenantRoutes)
app.use('/contractor-assignments',  contractorassignmentRoutes)
app.use('/tickets',                 ticketRoutes)
app.use('/ticket-media',            ticketmediaRoutes)
app.use('/ticket-notes',            ticketnoteRoutes)
app.use('/units',                   unitRoutes)
app.use('/users',                   userRoutes)


connection
app.listen(5000,()=>{
    console.log("Listening to port 5000")
})