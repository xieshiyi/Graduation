const Influx = require('influx');

const influx = new Influx.InfluxDB({
 host: 'localhost',
 database: 'graduation',
 schema: [
   {
     measurement: 'monitor',
     fields: {
       height: Influx.FieldType.FLOAT
     },
     tags: [
       'number'
     ]
   }
 ]
})
influx.writePoints([
  {
    measurement: 'monitor',
    tags: { number: 2  },
    fields: { height:998 },
  }
]).then(() => {
   return influx.query(`
    select * from monitor 
  `)
}).then(rows => {
   
 rows.forEach(row => console.log(`A request to ${row.time} - ${row.number}- ${row.height}`))
  //rows.forEach(row => res.json(`A request to ${row.time} - ${row.number}- ${row.height}`))
})
