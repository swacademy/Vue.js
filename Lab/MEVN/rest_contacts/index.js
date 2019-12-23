const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()    //express app 생성

app.use(bodyparser.json())   //json 형식 parsing하기
app.use(cors())   //cors 적용

const dbconfig = require('./db.js')
const mongoose = require('mongoose')
//Database 연결 및 상태 경로
mongoose.connect(dbconfig.url, { useNewUrlParser:true})
.then(() => {
    console.log('MongoDB Connect Success.')
}).catch(err => {
    console.log('MongoDB Connect Failure', err)
})

app.get('/', (req, res) => {
    console.log(req)
    res.json({'message': 'Welcome! Hello, World!!!'})
})

require('./router.js')(app);
let port = process.env.PORT || 8000  //Server Port 설정

//Client으로부터 요청 받기
app.listen(port, () => {
    console.log('Port : ' + port + ' is ready...')
})