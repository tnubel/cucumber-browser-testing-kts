var { defineSupportCode } = require('cucumber');

require('dotenv').config();

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import {ItemListPageModel,ItemRepresentation} from '../page-models/item-list-model';

chai.use(chaiAsPromised);

var expect = chai.expect;

import { protractor, browser } from 'protractor';

defineSupportCode(function ({ Given, Then, When }) {
  Given('I am on the item list page', function () {
    return ItemListPageModel.NavigateTo().then(() => {
      return browser.sleep(1000);
    });
  });

  // In the step text, the text within {brackets} is the "data type" of the argument - 
  // you can name the arguments anything you want within the callback signature
  // Remember to remove the callback argument if you're not using it
  When('I add a new item with an ID of {stringInDoubleQuotes} called {stringInDoubleQuotes} with {stringInDoubleQuotes} inventory and a description of {stringInDoubleQuotes}',
  function (itemID, itemTitle, itemInventory, description /* , callback */) {
    return ItemListPageModel.AddItem(itemID, itemTitle, description, itemInventory);
  });

  Then('I should see that the item list contains an item with ID {stringInDoubleQuotes}', function (itemID) {
    // Write code here that turns the phrase above into concrete actions   
    return ItemListPageModel.Items.then(items => {
        return expect(items.filter(itemRep => itemRep.ID == itemID).length).to.equal(1);
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
    //chai-as-promised lets us avoid nasty then chains inside our steps, but it's not necessary
    return expect(getInv).to.eventually.equal(inventory);
  });



});