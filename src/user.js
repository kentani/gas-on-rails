class User extends Record {
  constructor(index, [id, name, age] = []) {
    super(index);
    this.id = id;
    this.name = name;
    this.age = age;
  }

  static config() {
    const config = {
      tableId: __tableId,
      tabelName: 'user',
      column: ['id', 'name', 'age'],
      range: 'A2:C',
      startRow: 2,
    }

    return config;
  }
}