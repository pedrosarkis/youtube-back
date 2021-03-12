let x = 0;
let value = 0;
const recursion = (n) => {
    x += 1;
    value = n; 
    console.log(x, n);
    if (n === 1) return n;
    return n * recursion(n -1);
}   

recursion(5);