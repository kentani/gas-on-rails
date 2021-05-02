const properties = PropertiesService.getScriptProperties().getProperties();
const __tableId = properties.tableId;

function setProperties() {
  PropertiesService.getScriptProperties().setProperty('tableId','');
}

class Record {
  constructor(index) {
    this.index = index;
  }

  static table() {
    if (!!this._table) return this._table;

    const config = this.config();
    this._table = SpreadsheetApp.openById(config.tableId).getSheetByName(config.tabelName);

    return this._table;
  }

  static records() {
    if (!!this._records) return this._records;

    const config = this.config();

    this._records = this.table().getRange(config.range).getValues().map((record, i) => {
      let index = i + config.startRow;
      return new this(index, record);
    });

    return this._records;
  }

  static ifInvalidArgs(args, callback) {
    if (typeof callback !== "function") { throw new TypeError(`${callback} is not a function`); }

    const column = this.config().column;
    const invalidArgs = Object.keys(args).filter(i => column.indexOf(i) == -1);
    const isInvalid = invalidArgs.length > 0;

    if (isInvalid) { callback(invalidArgs); }

    return invalidArgs;
  }

  static all() {
    return this.records();
  }

  static where(args) {
    this.ifInvalidArgs(args, (invalidArgs) => { throw new Error(`${invalidArgs} is invalid args`); })
    const records = this.all().filter(record => Object.keys(args).every(key => record[key] === args[key]));

    return records;
  }

  static find_by(args) {
    this.ifInvalidArgs(args, (invalidArgs) => { throw new Error(`${invalidArgs} is invalid args`); })

    return this.where(args)[0];
  }

  static create(args) {
    this.ifInvalidArgs(args, (invalidArgs) => { throw new Error(`${invalidArgs} is invalid args`); })

    const column = this.config().column;
    const row = column.map(c => args[c]);
    const result = this.table().appendRow(row);

    return result;
  }

  update(args) {
    this.constructor.ifInvalidArgs(args, (invalidArgs) => { throw new Error(`${invalidArgs} is invalid args`); })

    const column = this.constructor.config().column;
    const row = column.map(c => args[c] || this[c]);
    const result = this.constructor.table().getRange(this.index, 1, 1, column.length).setValues([row]);

    return result;
  }

  destroy() {
    const result = this.constructor.table().deleteRows(this.index);

    return result;
  }
}