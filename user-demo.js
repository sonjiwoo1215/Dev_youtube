const express = require('express')
const app = express()
app.listen(7777)
app.use(express.json())

let db = new Map()
var id = 1

app.post('/login',(req,res)=>{

    const {userId, password} = req.body
    var loginUser = {}

    db.forEach((user,id)=>{
        if(user.userId === userId){
            loginUser = user
        }
    })

    if(isExist(loginUser)){
        console.log("id같음")
        
        if(loginUser.password === password){
            console.log("pw같음")
        }else{  
            console.log("pw틀림")
        }

    }else{
        console.log("입력하신 id는 없는 아이디다.")
    }
})

function isExist(obj){
    // if(obj.constructor === Object) 
    if(Object.keys(obj).length){
        return true;
    }else{
        return false;
    }
}

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