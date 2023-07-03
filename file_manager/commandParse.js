export default (input) => {
    let result = [];
    let flag = false;
    let currentString = '';
    
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        if (char === '"' || char === '\'') {
            flag = !flag;
            continue;
        }
        
        if (flag) {
            currentString += char;
        } else if (char === ' ') {
            if (currentString !== '') {
            result.push(currentString);
            currentString = '';
            }
        } else {
            currentString += char;
        }
    }
    
    if (currentString !== '') {
        result.push(currentString);
    }

    return result;
};