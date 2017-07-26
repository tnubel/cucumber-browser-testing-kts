var { defineSupportCode } = require('cucumber');

require('dotenv').config();

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import {ItemListPageModel,ItemRepresentation} from '../page-models/item-list-model';
import { protractor, browser, element, by } from 'protractor';


var expectedCondition = protractor.ExpectedConditions;

chai.use(chaiAsPromised);
var expect = chai.expect;

defineSupportCode(function ({ Given, Then, When }) {
  Given('I am on the item list page', function () {
    return ItemListPageModel.NavigateTo().then(() => {
      return browser.sleep(2000);
    });
  });

  // In the step text, the text within {brackets} is the "data type" of the argument - 
  // you can name the arguments anything you want within the callback signature
  // Remember to remove the callback argument if you're not using it
  When('I add a new item with an ID of {stringInDoubleQuotes} called {stringInDoubleQuotes} with {stringInDoubleQuotes} inventory and a description of {stringInDoubleQuotes}',
  function (itemID, itemTitle, itemInventory, description /* , callback */) {
    return ItemListPageModel.AddItem(itemID, itemTitle, description, itemInventory);
  });

  //Regular expressions can help make your steps more concise
  Then(/I should see that the item list (contains|does not contain) an item with ID "(\d+)\"/, function (operand,itemID) {
    return ItemListPageModel.Items.then(items => {
        let itemsCt = items.filter(itemRep => itemRep.ID == itemID).length;
        if (operand == "contains")
        {
          return expect(itemsCt).to.equal(1);
        }
        else{
          return expect(itemsCt).to.equal(0);
        }
    });
  });

  Then('I should see that the item with an ID of {stringInDoubleQuotes} is named {stringInDoubleQuotes}', 
  function (itemId, itemName) {
    let getItemTitle = ItemListPageModel.GetItemById(itemId).then(item => {
      return item.Title;
    });
    //chai-as-promised lets us avoid nasty then chains inside our steps, but it's not necessary
    return expect(getItemTitle).to.eventually.equal(itemName);
  });

  Then('I should see that the item with an ID of {stringInDoubleQuotes} has {stringInDoubleQuotes} inventory', 
    function (itemId, inventory) {
    let getInv = ItemListPageModel.GetItemById(itemId).then(item => {
      return item.Inventory;
    });

    return expect(getInv).to.eventually.equal(inventory);
  });

  When(/I click the (Edit|Buy|Sell|View|Delete) button next to the item with ID "(\d+)\"/, function (label,id) {    
      return ItemListPageModel.clickButton(id,label.toLowerCase()).then(()=>
      {
        if (label != "View")
        {
          return browser.wait(expectedCondition.presenceOf(ItemListPageModel.TitleField));
        }
        else{
          return;
        }
      });
  }); 

  When('I enter a description of {stringInDoubleQuotes}', function (description) {    
    return ItemListPageModel.EditDescription(description);
  });

  When('I click the Save button', function () {
    return ItemListPageModel.SaveEdit().then(()=>{
      return browser.wait(expectedCondition.urlIs(process.env.BASE_URL+"/item-list"),4000);
    });
  });

  Then('I should see that the item with an ID of {stringInDoubleQuotes} has a description of {stringInDoubleQuotes}', function (itemId, description)
  {   
    let getDescription = ItemListPageModel.GetItemById(itemId).then(item => {
      return item.Description;
    });

    return expect(getDescription).to.eventually.equal(description);

  });

  Then('I should see that I am viewing the details page for the item with an ID of {stringInDoubleQuotes}', function (itemID) {
    return browser.wait(expectedCondition.urlIs(process.env.BASE_URL+"/item/"+itemID));
  });

});