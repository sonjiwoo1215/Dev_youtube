const express = require('express')
const app = express()
app.listen(7777)
app.use(express.json())

let db = new Map()
var id = 1

app.post('/login',(req,res)=>{
    
})

app.post('/join',(req,res)=>{
    console.log(req.body)

    if(req.body == {}){
        res.status(400).json({
            message : `입력값을 확인해주세요.`
        })
    }else{
        db.set(id++, req.body)

        res.status(201).json({
            message : `${db.get(id-1).name}님 환영합니다.`
       })
    }

})


app
    .route('/users/:id')
    .get((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if(user == undefined){
            res.status(404).json({
                message : "회원정보가 없다."
            })
        }else{
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }
    })
    .delete((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if(user == undefined){
            res.status(404).json({
                message : "회원정보가 없습니다."
            })
        }else{
            db.delete(id)
            res.status(200).json({
                message : `${user.name}님 다음에 또 뵙겠습니다.`
            })
        }
    })



// app.get('/users/:id',(req,res)=>{
//     let {id} = req.params
//     id = parseInt(id)

//     const user = db.get(id)
//     if(user == undefined){
//         res.status(404).json({
//             message : "회원정보가 없습니다."
//         })
//     }else{
//         res.status(200).json({
//             userId : user.userId,
//             name : user.name
//         })
//     }
// })

// app.delete('/users/:id',(req,res)=>{
//     let {id} = req.params
//     id = parseInt(id)

//     const user = db.get(id)
//     if(user == undefined){
//         res.status(404).json({
//             message : "회원정보가 없습니다."
//         })
//     }else{
//         db.delete(id)
//         res.status(200).json({
//             message : `${user.name}님 다음에 또 뵙겠습니다.`
//         })
//     }
// })