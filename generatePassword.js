        // By Custom Selector
const inputSlider = document.querySelector("[data-length-Slider]");
const lengthNumber = document.querySelector("[data-length-Number]");
const passwordDisplay = document.querySelector("[data-password-Display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-Msg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*(){}[]-=+_/?.><",:;|';
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
// Set Strength Circle Color to gray
setIndicator('#ccc')

                    // Handle Slider Function :- Set length of password by Slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthNumber.innerText = passwordLength;

    const minv = inputSlider.min;
    const maxv = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength-minv) * 100 / (maxv-minv)) + "% 100%";
};

function setIndicator(c){
    indicator.style.backgroundColor = c;

    // Shadow Dalo
    indicator.style.boxShadow = `0px 0px 12px 1px ${c}`;
};

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
};

function generateRndNumber(){
    return getRndInteger(0,9);
};

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,122));
};

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
};

function generateSymbol(){
    let len = symbols.length;
    const randNum = getRndInteger(0,len);
    return symbols.charAt(randNum);
};

function calcStrength(){
    let hashUpper = false;
    let hashLower = false;
    let hashNum = false;
    let hashSym = false;

    if(upperCaseCheck.checked) hashUpper = true;
    if(lowerCaseCheck.checked) hashLower = true;
    if(symbolsCheck.checked) hashSym = true;
    if(numbersCheck.checked) hashNum = true;

    if(hashUpper && hashLower && (hashNum || hashSym) && passwordLength>=9){
        setIndicator("#0f0");
    }
    else if((hashLower || hashUpper) && (hashSym || hashSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
};

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML = 'Copied';
    }
    catch(err){
        copyMsg.innerHTML = 'Failed';
        console.log('Doesnot able to Copy due to :- ', err);
    }
        // To make Copy vala Msg Visible
    copyMsg.classList.add("active");

    setTimeout (function(){
        copyMsg.classList.remove("active");
    },2000);
};

inputSlider.addEventListener('input', function(ev){
    passwordLength = ev.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', function(){
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        };
    });
        // Extra Case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    };
};

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

function shufflePassword(arr){
    // Fisher Yates Method
    for(let i=arr.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    let str = "";
    arr.forEach((el) => (str += el));
    return str;
};

generateBtn.addEventListener('click', function(){
    // none of the checkbox are selected
    if(checkCount==0){
        return ;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's Start the journey to find new Password

        // remove old password
    password = "";

        // Let's put the stuff mentioned
    // if(upperCaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    // if(numbersCheck.checked){
    //     password += generateRndNumber();
    // }

        //  or
    let funckrr = [];

    if(upperCaseCheck.checked) funckrr.push(generateUpperCase);
    if(lowerCaseCheck.checked) funckrr.push(generateLowerCase);
    if(symbolsCheck.checked) funckrr.push(generateSymbol);
    if(numbersCheck.checked) funckrr.push(generateRndNumber);

    // Compulsary Addition
    for(let i=0;i<funckrr.length;i++){
        password += funckrr[i]();
    }

    // Remaining Addition
    for(let i=0; i<passwordLength - funckrr.length; i++){
        let randIdx = getRndInteger(0,funckrr.length);
        password += funckrr[randIdx]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show it in the UI
    passwordDisplay.value = password;

    // Calculate Strength
    calcStrength();
});