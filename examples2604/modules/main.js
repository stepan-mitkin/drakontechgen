const { fibonacci } = await import("./subfolder/cool1.js");

function main() {
    const ordinal = 10;
    const result = fibonacci(ordinal);
    var message = `The ${ordinal}th Fibonacci number is ${result}.`;
    console.log(message);
    const mainDiv = document.getElementById("main");
    if (mainDiv) {
        mainDiv.textContent = message;
    }
}

main();