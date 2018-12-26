import { Accounts } from 'meteor/accounts-base';
 Accounts.ui.config({
 	//на сайте показывает только юзернэйм 
  passwordSignupFields: 'USERNAME_ONLY',
  
});