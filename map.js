


//map() method creates a new array populated with the results of calling a provided function on every element in the calling array.

// Increment each element in the array by 1
let marks = [45, 67, 89, 23, 78];
// Using map to create a new array with incremented values
new_marks=marks.map(i=> i+1);
// Display the new array
console.log(new_marks);


// Increase each price in the array by 10%
let prices =[13,15,17,19,21];
// Using map to create a new array with increased prices .toFixed(2) to keep two decimal places
new_prices=prices.map(i=>+(i*1.1).toFixed(2));
console.log(new_prices);



// Using  filter and map to create a new array with each employee's salary increased by 10% only if the salary is below 30000
const employee=[
    {name: "Eve", salary: 30000},
    {name: "Frank", salary: 45000},
    {name: "Grace", salary: 25000},
    {name: "Hank", salary: 50000}

]

const dashainBonus=employee
.filter(i=> i.salary<=30000)  // filter employees with salary >= 30000
.map(i=> (i.salary*1.1).toFixed(0));  //  calculate + format Adding 10% bonus to each employee's salary
 console.log(`Salary with Bonus will be" ${dashainBonus}`);