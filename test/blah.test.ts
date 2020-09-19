import SA from 'superagent'
import { install } from '../src'

const request = SA.agent()
install(request)

it('fake test', () => {
  expect(true).toBeTruthy()
})

// it('doo', async () => {
//   const successful = await request.log2ECNU('', '')
//   expect(successful).toBeTruthy()
// })
