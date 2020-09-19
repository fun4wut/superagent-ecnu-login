import SA from 'superagent'
import { createWorker } from 'tesseract.js'

import encode from './des'
import images from 'images'

const LOGIN_URL =
  'https://portal1.ecnu.edu.cn/cas/login?service=http%3A%2F%2Fportal.ecnu.edu.cn%2Fneusoftcas.jsp'
const PIC_URL = 'https://portal1.ecnu.edu.cn/cas/code'

declare module 'superagent' {
  interface SuperAgentStatic {
    log2ECNU(username: string, password: string): Promise<boolean>
  }
}

// install the extension
export function install(request: SA.SuperAgentStatic) {
  request.log2ECNU = async function(username: string, password: string) {
    const res = await request.get(LOGIN_URL)

    let ltReg = /id="lt" name="lt" value="(.*?)" \/>/
    let executionReg = /name="execution" value="(.*?)" \/>/

    const lt = ltReg.exec(res.text)![1]
    const execution = executionReg.exec(res.text)![1]
    const rsa = encode(username + password + lt, '1', '2', '3')

    const pic = await request
      .get(PIC_URL)
      .buffer(true)
      .parse(SA.parse.image)
    const code = await recognizeImg(pic.body)

    const res2 = await request
      .post(LOGIN_URL)
      .type('application/x-www-form-urlencoded')
      .send({
        code,
        loginFace: '',
        rsa,
        ul: 11,
        pl: 8,
        lt,
        execution,
        _eventId: 'submit',
      })
      .catch(e => {
        console.error(e.response.text)
        throw e
      })

    return res2.redirects.length > 0
  }
}

async function recognizeImg(buf: Buffer) {
  const worker = createWorker({
    // self OSS
    langPath: 'https://gofun4-pic.oss-cn-hangzhou.aliyuncs.com',
    gzip: false,
  })
  await worker.load()
  await worker.loadLanguage('digits_layer')
  await worker.initialize('digits_layer')
  const {
    data: { text },
  } = await worker.recognize(images(buf).toBuffer('jpg'))
  await worker.terminate()
  return text.replace(/\s+/g, '')
}
