const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const {body, param, validationResult} = require('express-validator')

router.use(express.json())

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()) {
        return next();
    }else{
        return res.status(400).json(err.array())
    }
}

router
    .route('/')
    .get(
        [
        body('userId').notEmpty().isInt().withMessage('숫자 입력하시오'),
        validate
        ],
        (req, res, next) => {
            const err = validationResult(req)

            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            var { userId } = req.body

            let sql = `SELECT * FROM channels WHERE user_id = ?`

            conn.query(sql, userId,
                function (err, results) {
                    if(err){
                        return res.status(400).end()
                    }
                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundChannel(res)
                    }
                }
            )
    })

    .post(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력하시오'),
            body('name').notEmpty().isString().withMessage('문자 입력하시오'),
            validate
        ]
        , (req, res) => {
            const { name, userId } = req.body
            
                let sql = `INSERT INTO channels (name, user_Id) VALUES (?, ?)`
                let values = [name, userId]
                conn.query(sql, values,
                    function (err, results) {
                        if(err){
                            return res.status(400).end()
                        }
                        res.status(201).json(results)
                    }
                )
            
    })

router
    .route('/:id')
    .get(
        [param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ],
        (req,res)=>{
            let { id } = req.params
            id = parseInt(id)

            let sql = `SELECT * FROM channels WHERE id = ?`
            conn.query(sql, id,
                function (err, results) {
                    if (err) {
                        return res.status(400).end()
                    }
                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundChannel(res)
                    }
                }
            );
    })

    .put(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            body('name').notEmpty().isString().withMessage('채널명 오류'),
            validate
        ],
        (req, res) => {
            let { id } = req.params
            id = parseInt(id)
            let { name } = req.body

            let sql = `UPDATE channels SET name=?
                       WHERE id=?`
            let values = [name, id]
            conn.query(sql, values,
                function (err, results) {
                    if (err) {
                        return res.status(400).end()
                    }
                    if(results.affectedRows == 0){ 
                        return res.status(400).end()
                    }else{
                    res.status(200).json(results)
                    }
                }
            );
        })

    .delete(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ],
        (req,res)=>{
        let {id} = req.params
        id = parseInt(id)

        let sql = `DELETE FROM channels WHERE id = ?`
        conn.query(sql, id,
            function (err, results) {
                if (err) {
                    return res.status(400).end()
                }
                if(results.affectedRows == 0){ 
                    return res.status(400).end()
                }else{
                res.status(200).json(results)
                }
            }
          );
    })

function notFoundChannel(res){
    res.status(404).json({
        message : "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router