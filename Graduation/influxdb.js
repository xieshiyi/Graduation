const Influx = require('influx');
var randomNumber=Math.ceil(Math.random()*4);
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
    tags: { number: randomNumber  },
    fields: { height:Math.random() },
  }
]).then(() => {
   return influx.query(`
    select * from monitor 
  `)
}).then(rows => {
   
 rows.forEach(row => console.log(`A request to ${row.time} - ${row.number}- ${row.height}`))
  //rows.forEach(row => res.json(`A request to ${row.time} - ${row.number}- ${row.height}`))
})
