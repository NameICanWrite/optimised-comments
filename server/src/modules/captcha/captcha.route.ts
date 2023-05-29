import { Router, Request, Response } from 'express';
import svgCaptcha from 'svg-captcha'
import { Captcha } from './Captcha';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const {data, text} = svgCaptcha.create()
  const {id} = await Captcha.save({text})
  console.log('captcha created: ', `id: ${id}, text: ${text}`);
  return res.send({id, svg: data})
})

export default router;
