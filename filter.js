

// Example of using filter to create a new array with only non-negative values
let data = [12, 14, 8,-1,-3],
new_data = data.filter(i => i>=0);
// Using filter to create a new array with only non-negative values
console.log(new_data);



// Example of using map to print each employee's name and age
let employees = [
    {name: "Alice", age: 25},
    {name: "Bob", age: 17},
    {name: "Charlie", age: 19},
    {name: "David", age: 15}
];
// Using map to print each employee's name
employees.map(i=> console.log(`Mr ${i.name} age is ${i.age}`)); // Output: Mr Alice age is 25, Mr Bob age is 17, etc.



// Using filter to create a new array with only adult employees (age >= 18)
const adult=employees.filter(i=> i.age>=18);
console.log(adult);// console.log(`adult employees are ${i.adult}`);


// Using map to create a new array by adding 5 to each number 
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const newData=numbers.map(i=> i+5);
console.log(newData);// Output: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]


// Using filter to create a new array with only students who scored 90 or above
const students = [
    {name: "John", score: 85},
    {name: "Jane", score: 92},
    {name: "Jim", score: 78},
    {name: "Bean", score: 95}
];
const bestStudents=students.filter(i=> i.score>=90);
console.log("bestStudents are ",bestStudents);// Output: [{name: "Jane", score: 92}, {name: "Bean", score: 95}]



