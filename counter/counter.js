const h1= document.querySelector('h1'); //selecting h1 element
//increase function 
let count = 0;
//increase function
function plus(){
    count++;
    h1.textContent = count;//updating h1 text content
    h1.style.color = 'green';//changing color to green when increased
}


//decrease function
function minus(){
    if (count==0)return;
    count--;

    h1.textContent = count;//updating h1 text content
    h1.style.color = 'red';//changing color to red when decreased
}

function reset(){
    count=0;
    h1.textContent = count;
    h1.style.color = 'black';//changing color to black when reset
}

