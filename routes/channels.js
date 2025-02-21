const express = require('express')
const router = express()

router.use(express.json())

let db = new Map()
var id = 1

router
    .route('/')
    .get((req,res)=>{
        var {userId} = req.body
        var channels = []
        if(db.size && userId){
            db.forEach((value, key)=>{
                if(value.userId === userId)
                    channels.push(value)  
            })
            if(channels.length){
                res.status(200).json(channels)
            }else{
                notFoundChannel()
            }
        }else{
            notFoundChannel()
    }
    })

    .post((req,res)=>{
        if(req.body.channelTitle){
            let channel = req.body
            db.set(id++,channel)

            res.status(201).json({
                message : `${db.get(id-1).channelTitle}님 채널을 응원합니다. }`
            })
        }else{
            res.status(400).json({
                message : "요청 값을 제대로 보내주세요."
            })
        }
    })

router
    .route('/:id')
    .get((req,res)=>{
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if(channel){
            res.status(200).json(channel)
        }else{
            notFoundChannel()
        }
    })

    .put((req,res)=>{
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        var oldTitle = channel.channelTitle
        if(channel){
            var newTitle = req.body.channelTitle
            db.set(id,channel)
            res.json({
                message : `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle}-> 수정 ${newTitle}`
            })
        
        }else{
            notFoundChannel()
        }

    })

    .delete((req,res)=>{
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if(channel){
            db.delete(id)
            res.status(200).json({
                message : `${channel.channelTitle}이 정상적으로 삭제되었습니다.`
            })
        }else{
            notFoundChannel()
        }
    })

function notFoundChannel(){
    res.status(404).json({
        message : "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router