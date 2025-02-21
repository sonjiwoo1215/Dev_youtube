const express = require('express')
const router = express.Router()

router.use(express.json())

let db = new Map()
var id = 1

router.post('/login',(req,res)=>{

    const {userId, password} = req.body
    var loginUser = {}

    db.forEach((user,id)=>{
        if(user.userId === userId){
            loginUser = user
        }
    })

    if(isExist(loginUser)){
        
        if(loginUser.password === password){
            res.status(200).json({
                message : `${loginUser.name}님 로그인 되었습니다.`
            })
        }else{  
            res.status(400).json({
                message : `비밀번호가 틀렸습니다.`
            })
        }

    }else{
        res.status(404).json({
            message : `회원정보가 없습니다.`
        })
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

router.post('/join',(req,res)=>{
    console.log(req.body)

    if(req.body == {}){
        res.status(400).json({
            message : `입력값을 확인해주세요.`
        })
    }else{
        const {userId} = req.body
        db.set(userId, req.body)

        res.status(201).json({
            message : `${db.get(userId).name}님 환영합니다.`
       })
    }

})


router
    .route('/users')
    .get((req,res)=>{
        let {userId} = req.body
    
        const user = db.get(userId)
        if(user){
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }else{
            res.status(404).json({
                message : "회원정보가 없다."
            })
        }
    })
    .delete((req,res)=>{
        let {userId} = req.body
    
        const user = db.get(userId)

        if(user){
            db.delete(id)
            res.status(200).json({
                message : `${user.name}님 다음에 또 뵙겠습니다.`
            })
        }else{
            res.status(404).json({
                message : "회원정보가 없습니다."
            })
        }
    })


module.exports = router
// router.get('/users/:id',(req,res)=>{
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

// router.delete('/users/:id',(req,res)=>{
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