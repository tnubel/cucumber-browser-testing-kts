var { defineSupportCode } = require('cucumber');

require('dotenv').config();
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;

import { element, protractor, browser, by, promise, ElementFinder } from 'protractor';

//Define selectors in a single spot for easy updates later
const addItemButtonSelector = "button[aria-label='add']";
const newTitleFieldSelector = ".mat-list-item-content input[placeholder='Name']";
const newDescriptionFieldSelector = ".mat-list-item-content input[placeholder='Description']";
const newIdFieldSelector = ".mat-list-item-content input[placeholder='ID']";
const newInventoryFieldSelector = ".mat-list-item-content input[placeholder='Inventory']";

//This selector is getting a little tricky - work with developers to add testing classes to avoid brittle selectors like this
const itemSelector = "md-list-item app-item-view>div>div:last-child";

export class ItemListPageModel {

  //Create static 'get' methods that return elements - then use them in your functions.
  public static get AddItemButton(): ElementFinder {
    return element(by.css(addItemButtonSelector));
  }

  public static get IdField(): ElementFinder {
    return element(by.css(newIdFieldSelector));
  }

  public static get TitleField(): ElementFinder {
    return element(by.css(newTitleFieldSelector));
  }

  public static get DescriptionField(): ElementFinder {
    return element(by.css(newDescriptionFieldSelector));
  }

  public static get InventoryField(): ElementFinder {
    return element(by.css(newInventoryFieldSelector));
  }

  public static get Items(): promise.Promise<ItemRepresentation[]> {
    var elements = element.all(by.css(itemSelector));

    var itemPromises : promise.Promise<ItemRepresentation>[] = [];
    var itemReps = [];
    var itemPromisesPromise = elements.map(el => 
    {
        return ItemRepresentation.getItemRepresentation(el);
    });
      
    return itemPromisesPromise.then((itemPromises : promise.Promise<ItemRepresentation>[]) => {
      return promise.all(itemPromises).then(items =>
        {
          console.log(items);
          return items;
        });
    });
  }


  /// METHODS

  public static NavigateTo(): promise.Promise<void> {
    return browser.get(`${process.env.BASE_URL}/item-list`);
  }

  public static AddItem(id: string, title: string, description: string, inventory: string): promise.Promise<void> {
    return this.IdField.sendKeys(id).then(() => {
      return this.TitleField.sendKeys(title).then(() => {
        return this.DescriptionField.sendKeys(description).then(() => {
          return this.InventoryField.sendKeys(inventory).then(() => {
            return this.AddItemButton.click();          
          });
        });
      });
    });
  }

  public static GetItemById(id: string): promise.Promise<ItemRepresentation> {
    return this.Items.then(items => {
      var matchingItems = items.filter(itemRep => itemRep.ID == id);
      if (matchingItems.length == 0) return null;
      return matchingItems[0];
    });
  }
}

export class ItemRepresentation {
  public ID: string;
  public Title: string;
  public Inventory: string;
  public Description: string;

  static idSelector = " div:nth-child(1)";
  static titleSelector = " div:nth-child(2)";
  static inventorySelector = " div:nth-child(4)";
  static descriptionSelector = " div:nth-child(3)";

  public static getItemRepresentation(container: ElementFinder): promise.Promise<ItemRepresentation> {
    var itemRep = new ItemRepresentation();

    var propertyPromises = [
      container.all(by.css(ItemRepresentation.idSelector)).first().getText().then(text => {
        itemRep.ID = text;
      }),
      container.all(by.css(ItemRepresentation.titleSelector)).first().getText().then(text => {
        itemRep.Title = text;
      }),
      container.all(by.css(ItemRepresentation.inventorySelector)).first().getText().then(text => {
        itemRep.Inventory = text;
      }),
      container.all(by.css(ItemRepresentation.descriptionSelector)).first().getText().then(text => {
        itemRep.Description = text;
      })
    ];

    return promise.all(propertyPromises).then((promises) => {
      return itemRep;
    });

  }
}