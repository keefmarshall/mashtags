async function init() {
    const response = await fetch("hosts.html")
    if (response.ok) {
        const html = await response.text()
        document.getElementById("hosts").innerHTML = html
    }
}

init().then(() => {
    console.log("hosts loaded")
});