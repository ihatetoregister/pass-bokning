import {JSDOM} from 'jsdom';

export async function accLivingInSweden(send, pers, livingInSweden){
  // Bor du i Sverige?
  console.log('### Living in sweden');

  const boendeForm = pers.map((_, index) => {
    const i = {};
    i[`ServiceCategoryCustomers[${index}].CustomerIndex`] = index;
    i[`ServiceCategoryCustomers[${index}].ServiceCategoryId`] = livingInSweden;
    return i;
  }).reduce((r, i) => ({...r, ...i}), {'Next': 'Nästa'});

  const res4 = await send(boendeForm);

  const dom4 = new JSDOM(res4.body);
  console.log('H1:', dom4.window.document.querySelector('h1').textContent);
}

export default accLivingInSweden;