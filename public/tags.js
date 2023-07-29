
function doError(status, e) {
    if (!e) {
        e = "status " + status
    }
    document.getElementById("error").innerText = "An error occurred: " + e
}

async function deleteTag(tag) {
    try {
        response = await fetch(`/app/tags/${tag}`, {
            method: "DELETE"
        })
        if (!response.ok) {
            console.error("Error: response status " + response.status)
            doError(response.status)
        } else {
            document.getElementById("list-item-" + tag).remove()
            console.log("Deleted tag " + tag)
        }
    } catch(e) {
        console.error(e)
        doError("0", e)
    }
}
