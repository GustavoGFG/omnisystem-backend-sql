import { privateRoute } from './../libs/passport';
import { Router } from 'express';

import * as auth from '../controllers/auth';
import * as employees from '../controllers/employee';
import * as salesgoal from '../controllers/salesgoal';
import * as dailysales from '../controllers/dailysales';
import * as mistake from '../controllers/mistake';

const router = Router();

router.get('/', (req, res) => {
  res.send('OmniSystem SQL Backend is Running');
});

router.get('/ping', (req, res) => {
  res.json({ pong: true });
});
// SIGNUP | LOGIN
router.post('/signup', auth.signup);
router.post('/login', auth.login);
// CHANGE PASSWORD
// router.put('/changepassword', auth.password)

// EMPLOYEE
router.get('/employee', employees.getAll);
router.get('/employee/:id', employees.getEmployee);
router.post('/employee', privateRoute, employees.addEmployee);
router.put('/employee/:id', employees.updateEmployee);
router.delete('/employee/:id', employees.deleteEmployee);

// SALE GOAL
router.get('/salesgoal', salesgoal.getAll);
router.get('/salesgoal/:saledate', salesgoal.getSaleGoal);
router.post('/salesgoal', salesgoal.addSaleGoal);
router.put('/salesgoal/:saledate', salesgoal.updateSaleGoal);
router.delete('/salesgoal/:saledate', salesgoal.deleteSaleGoal);

// DAILY SALE
router.get('/dailysale', dailysales.getAll);
// GET ALL FROM YEAR
// router.get('/dailysale/:year', dailysales.getOne);
// GET ALL FROM MONTH
// router.get('/dailysale/:month', dailysales.getOne);
// GET ALL FROM DAY
// router.get('/dailysale/:day', dailysales.getOne);
//
router.get('/dailysale/:id', dailysales.getOne);
router.post('/dailysale', dailysales.add);
router.post('/dailysales', dailysales.addMany);
router.post('/upsertsales', dailysales.upsertMany);
router.put('/dailysale/:id', dailysales.update);

router.delete('/dailysale/:id', dailysales.remove);

// MISTAKE
router.get('/mistake', mistake.getAll);
router.get('/mistake/:id', mistake.getOne);
router.post('/mistake/', mistake.add);
router.post('/upsertmistakes', mistake.upsertMany);
router.put('/mistake/:id', mistake.update);
router.delete('/mistake/:id', mistake.remove);

export default router;
