const Koa = require('koa');
const axios = require('axios');
const request = require('request');
const logger = require('koa-logger');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const sharp = require('sharp');
const fs = require('fs');

const app = new Koa();

app.use(cors());

const router = new Router();

app.use(bodyParser());

app.use(logger());

async function downloadImage (url) {  
    const writer = fs.createWriteStream('./images/file.jpeg')
  
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

router.post('/sharp-image', async (ctx)=>{
    await downloadImage(ctx.request.body.url)
    .then(async ()=>{
        await sharp('./images/file.jpeg')
        .webp()
        .toBuffer()
        .then(data=>{
            ctx.body = data;
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

app.use(router.routes());

app.listen(3001);
