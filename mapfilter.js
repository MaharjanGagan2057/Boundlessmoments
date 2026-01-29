

// Chaining of map and filter methods
const employee=[
{name:"sujal",salary:"10000"},
{name:"rahul",salary:"20000"},
{name:"ajay",salary:"30000"},
]
// Give 50% bonus to employees having salary more than 10000
const bonusHolder=employee.filter(i=> i.salary>10000)
                          .map(i=>{
                            return {
                                name:i.name,
                                salary: i.salary*1.5
                            }
                          } )
                          console.log(bonusHolder);